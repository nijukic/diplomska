import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../helpers/AuthContext";
import {
  Autocomplete,
  Box,
  CssBaseline,
  IconButton,
  Paper,
  Popper,
  styled,
  TextField,
  Tooltip,
} from "@mui/material";
import { MapContainer, TileLayer, GeoJSON, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import stationData from "../assets/stationsWithNames.json";
import railwayData from "../assets/railway.json";
import borderData from "../assets/borderSlovenia.json";
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  Point,
} from "geojson";
import { Map as LeafletMap } from "leaflet";
import Station from "../components/Station";
import axios from "axios";
import MenuDrawer from "../components/MenuDrawer";
import CornerTab from "../components/CornerTab";
import TrainDetails from "../components/TrainDetails";
import TrainIcon from "@mui/icons-material/Train";
import AttributionDrawer from "../components/AttributionDrawer";

const geoJsonData: FeatureCollection<Geometry, GeoJsonProperties> =
  stationData as FeatureCollection<Geometry, GeoJsonProperties>;
const geoJsonData2: FeatureCollection<Geometry, GeoJsonProperties> =
  railwayData as FeatureCollection<Geometry, GeoJsonProperties>;
const geoJsonData3: FeatureCollection<Geometry, GeoJsonProperties> =
  borderData as FeatureCollection<Geometry, GeoJsonProperties>;

interface Train {
  datumZacetkaVoznjeVlaka: string;
  dodeljenaStevilkaVlaka: number;
  idLokomotiveVlaka: number;
  idPrevoznikaVlaka: number;
  statusVlaka: string;
  tipVlaka: string;
  zamudaVlaka: number;
  razlogNeaktivnostiVlaka: string;
  idTrenutnaPostajaVlaka: number;
  nazivPostaje: string;
  idZacetnaPostajaSZVlaka: number;
  nazivZacetnePostaje: string;
  idKoncnaPostajaSZVlaka: number;
  nazivKoncnePostaje: string;
  idPrejsnjePostajePostanka: number;
  nazivPrejsnjePostaje: string;
  idNaslednjePostajePostanka: number;
  nazivNaslednjePostaje: string;
}

interface Stop {
  dodeljenaStevilkaVlakaPostanka: number;
  datumZacetkaVoznjeVlakaPostanka: string;
  idPostajePostanka: number;
  nazivPostaje: string;
  nacrtovanPrihod: string;
  dejanskiPrihod: string;
  zamuda: number;
  idPrejsnjePostajePostanka: number;
  nazivPrejsnjePostaje: string;
  idNaslednjePostajePostanka: number;
  nazivNaslednjePostaje: string;
}

interface searchStation {
  label: string;
  dodatno: string;
}

export default function Home() {
  const { themeMode, vlogaUporabnika, idStrankeUporabnika } =
    useContext(AuthContext);
  const [activeTrains, setActiveTrains] = useState<Train[]>([]);
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [stations, setstations] = useState([]);

  const [showActiveTrains, setShowActiveTrains] = useState(true);

  const [activeMarker, setActiveMarker] = useState<number | null>(null);

  const [allStopsOfTrain, setAllStopsOfTrain] = useState<Stop[]>([]);

  const [showTrainDetails, setShowTrainDetails] = useState(false);
  const [showTrainDetailsTrain, setShowTrainDetailsTrain] = useState<Train>(
    {} as Train
  );

  const [searchStationValue, setSearchStationValue] =
    useState<searchStation | null>(null);

  useEffect(() => {
    const getAllStops = async () => {
      try {
        const allStops = await axios.post(
          "http://localhost:3001/station/allMiddleStations",
          {
            dodeljenaStevilka: showTrainDetailsTrain.dodeljenaStevilkaVlaka,
            date: showTrainDetailsTrain.datumZacetkaVoznjeVlaka,
          }
        );
        setAllStopsOfTrain(allStops.data);
      } catch (error) {
        console.error("Stations could not be fetched", error);
      }
    };

    getAllStops();
  }, [showTrainDetailsTrain]);

  useEffect(() => {
    if (vlogaUporabnika != "stranka") {
      const eventSource = new EventSource(
        "http://localhost:3001/datastream/activeTrains"
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setActiveTrains(data);
      };

      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
      };

      return () => {
        eventSource.close();
      };
    } else {
      const eventSource = new EventSource(
        "http://localhost:3001/datastream/activeTrainsCustomer"
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const filteredData = data.filter(
          (train: { idStrankeVagona: number }) =>
            train.idStrankeVagona === idStrankeUporabnika
        );

        setActiveTrains(filteredData);
      };

      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
      };

      return () => {
        eventSource.close();
      };
    }
  }, []);

  useEffect(() => {
    const getAllStations = async () => {
      try {
        const allStations = await axios.get(
          "http://localhost:3001/station/allStations",
          {}
        );

        setstations(allStations.data);
      } catch (error) {
        console.error("Stations could not be fetched", error);
      }
    };

    getAllStations();
  }, []);

  const attributionLight =
    '<a href="https://www.jawg.io?utm_medium=map&utm_source=attribution" target="_blank">&copy; Jawg</a> - <a href="https://www.openstreetmap.org?utm_medium=map-attribution&utm_source=jawg" target="_blank">&copy; OpenStreetMap</a>&nbsp;contributors';
  const urlLight =
    "https://tile.jawg.io/c60cf4d0-2ece-4e5b-957a-62b2a8ff8e7a/{z}/{x}/{y}{r}.png?access-token=vuQDVPhuaEqvn7qUtJrFQjvZQCTruD75ogmoq3O6sZqdzH3svu1P8rIE3lfrgkMC";

  const attributionDark =
    '<a href="https://www.jawg.io?utm_medium=map&utm_source=attribution" target="_blank">&copy; Jawg</a> - <a href="https://www.openstreetmap.org?utm_medium=map-attribution&utm_source=jawg" target="_blank">&copy; OpenStreetMap</a>&nbsp;contributors';
  const urlDark =
    "https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=vuQDVPhuaEqvn7qUtJrFQjvZQCTruD75ogmoq3O6sZqdzH3svu1P8rIE3lfrgkMC";

  const CustomPopper = styled(Popper)(({ theme }) => ({
    "& .MuiAutocomplete-listbox": {
      "&::-webkit-scrollbar": {
        width: "0.5em",
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "#f1f1f1",
        borderRadius: "0px",
        borderBottomRightRadius: "10px",
        boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3)",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: theme.palette.primary.light,
        borderRadius: "5px",
        border: "1px solid black",
      },
      "&::-webkit-scrollbar-thumb:hover": {
        backgroundColor: theme.palette.primary.main,
      },
    },
  }));

  return (
    <Box>
      <CssBaseline />
      {showTrainDetails && (
        <Box>
          <TrainDetails
            setShowTrainDetails={setShowTrainDetails}
            showTrainDetails={showTrainDetails}
            showTrainDetailsTrain={showTrainDetailsTrain}
            allStopsOfTrain={allStopsOfTrain}
            setSearchStationValue={setSearchStationValue}
            setShowTrainDetailsTrain={setShowTrainDetailsTrain}
            setAllStopsOfTrain={setAllStopsOfTrain}
            setShowActiveTrains={setShowActiveTrains}
          ></TrainDetails>
        </Box>
      )}
      <Box sx={{ height: "100vh", width: "100%", m: 0, p: 0 }}>
        <Paper
          elevation={10}
          sx={{
            minWidth: "400px",
            height: "60vh",
            width: "40vw",
            maxWidth: "500px",
            zIndex: "fab",
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius: 0,
            borderBottomRightRadius: 10,
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "0.5em",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
              borderRadius: "0px",
              borderBottomRightRadius: "10px",
              boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "primary.light",
              borderRadius: "5px",
              border: "1px solid black",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "primary.main",
            },
          }}
        >
          <MenuDrawer></MenuDrawer>
          <CornerTab
            activeMarker={activeMarker}
            setActiveMarker={setActiveMarker}
            activeTrains={activeTrains}
            setShowTrainDetails={setShowTrainDetails}
            setShowTrainDetailsTrain={setShowTrainDetailsTrain}
            setShowActiveTrains={setShowActiveTrains}
            setSearchStationValue={setSearchStationValue}
          ></CornerTab>
        </Paper>
        <Box sx={{ position: "absolute", bottom: 90, right: 2, zIndex: "fab" }}>
          <Tooltip
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: "offset",
                    options: {
                      offset: [0, -20],
                    },
                  },
                ],
              },
            }}
            arrow
            placement="left"
            title={showActiveTrains ? "Skrij vlake" : "Prikaži vlake"}
          >
            <IconButton
              onClick={() => {
                setShowActiveTrains(!showActiveTrains);
              }}
            >
              <TrainIcon
                color={showActiveTrains ? "primary" : "secondary"}
                fontSize="large"
              />
            </IconButton>
          </Tooltip>
        </Box>
        <AttributionDrawer></AttributionDrawer>
        <Paper
          elevation={10}
          sx={{
            zIndex: "fab",
            position: "absolute",
            top: 10,
            right: 5,
          }}
        >
          <Autocomplete
            onChange={(event: any, newValue: searchStation | null) => {
              setSearchStationValue(newValue);
            }}
            PopperComponent={CustomPopper}
            disablePortal
            id="searchBarStation"
            options={stations}
            sx={{ width: "20vw" }}
            isOptionEqualToValue={(option, value) =>
              option.label === value.label && option.dodatno === value.dodatno
            }
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              return (
                <Box
                  key={key}
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...optionProps}
                >
                  {option.label}, {option.dodatno}
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Iskalnik postaj"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "off",
                }}
              />
            )}
          />
        </Paper>
        <MapContainer
          ref={setMap}
          zoomControl={false}
          center={[46.156947, 14.805751]}
          zoom={9.05}
          minZoom={9}
          maxZoom={13}
          maxBounds={[
            // jugozahod
            [44.2, 10.5],
            // severovzhod
            [48, 19],
          ]}
          style={{ height: "100%", width: "100%" }}
        >
          <ZoomControl position="bottomright"></ZoomControl>
          <TileLayer
            attribution={themeMode ? attributionLight : attributionDark}
            url={themeMode ? urlLight : urlDark}
          />
          {geoJsonData.features.map((station) => (
            <Station
              key={station.properties?.stationNumber}
              activeTrains={activeTrains}
              station={station as Feature<Point>}
              searchStationValue={searchStationValue}
              activeMarker={activeMarker}
              setActiveMarker={setActiveMarker}
              setShowTrainDetails={setShowTrainDetails}
              setShowTrainDetailsTrain={setShowTrainDetailsTrain}
              allStopsOfTrain={allStopsOfTrain}
              showActiveTrains={showActiveTrains}
              showTrainDetails={showTrainDetails}
              showTrainDetailsTrain={showTrainDetailsTrain}
              setShowActiveTrains={setShowActiveTrains}
            />
          ))}
          <GeoJSON
            data={geoJsonData2}
            style={() => ({
              color: themeMode ? "#015194" : "#013765",
              weight: 2,
            })}
          />
          <GeoJSON
            data={geoJsonData3}
            style={() => ({
              color: themeMode ? "#013765" : "#ADADAD",
              weight: 3,
            })}
          />
        </MapContainer>
      </Box>
    </Box>
  );
}
