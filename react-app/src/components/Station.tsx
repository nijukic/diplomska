import { useContext, useEffect, useRef, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { Icon, Marker as baseMarker } from "leaflet";
import movingImage from "../assets/opcija3.gif";
import movingImageFocus from "../assets/opcija9.gif";
import movingImageDark from "../assets/opcija1.gif";
import movingImageDarkFocus from "../assets/opcija10.gif";
import redniVlak from "../assets/redniVlak.png";
import izredniVlak from "../assets/izredniVlak.png";
import zakljucil from "../assets/accept.png";
import lightMode from "../assets/lightMode.png";
import lightModeFocus from "../assets/darkModeFocus.png";
import darkMode from "../assets/darkMode.png";
import darkModeFocus from "../assets/lightMode.png";
import finish from "../assets/finish.png";
import finishMoving from "../assets/finish2.gif";
import finishMovingDark from "../assets/finish8.gif";
import start from "../assets/start.png";
import neaktiven from "../assets/neaktiven.png";

import arrows4 from "../assets/down-arrowLarge.png";
import { useTheme } from "@mui/material/styles";
import { Feature, Point } from "geojson";
import {
  Avatar,
  Box,
  Chip,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";

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

interface Props {
  activeTrains: Train[];
  station: Feature<Point>;
  searchStationValue: searchStation | null;
  activeMarker: number | null;
  setActiveMarker: (value: number | null) => void;
  setShowTrainDetails: (value: boolean) => void;
  setShowTrainDetailsTrain: (value: Train) => void;
  setShowActiveTrains: (value: boolean) => void;
  showActiveTrains: boolean;
  allStopsOfTrain: Stop[];
  showTrainDetails: boolean;
  showTrainDetailsTrain: Train;
}

const Station = ({
  activeTrains,
  station,
  searchStationValue,
  activeMarker,
  setActiveMarker,
  setShowTrainDetails,
  setShowTrainDetailsTrain,
  showActiveTrains,
  allStopsOfTrain,
  setShowActiveTrains,
  showTrainDetails,
  showTrainDetailsTrain,
}: Props) => {
  const map = useMap();
  const markerRef = useRef<baseMarker | null>(null);
  const [trainsAtStation, setTrainsAtStation] = useState<Train[]>([]);

  const { themeMode } = useContext(AuthContext);

  const [isHovered, setIsHovered] = useState(false);

  const [stationIsPartOfTrainRoute, setStationIsPartOfTrainRoute] =
    useState(false);

  const [icon, setIcon] = useState(
    themeMode
      ? new Icon({
          iconUrl: lightMode,
          iconSize: [35, 35],
          popupAnchor: [0, -15],
        })
      : new Icon({
          iconUrl: darkMode,
          iconSize: [35, 35],
          popupAnchor: [0, -15],
        })
  );

  useEffect(() => {
    if (!showTrainDetails) {
      setStationIsPartOfTrainRoute(false);
    } else {
      let isPart = false;
      for (let i = 0; i < allStopsOfTrain.length; i++) {
        const stop = allStopsOfTrain[i];

        if (stop.idPostajePostanka == station.properties?.stationNumber) {
          setStationIsPartOfTrainRoute(true);
          isPart = true;
          if (
            showTrainDetailsTrain.idKoncnaPostajaSZVlaka ==
            station.properties?.stationNumber
          ) {
            if (
              showTrainDetailsTrain.idTrenutnaPostajaVlaka ==
              station.properties?.stationNumber
            ) {
              setIcon(
                themeMode
                  ? new Icon({
                      iconUrl: finishMoving,
                      iconSize: [60, 60],
                      popupAnchor: [0, -15],
                    })
                  : new Icon({
                      iconUrl: finishMovingDark,
                      iconSize: [60, 60],
                      popupAnchor: [0, -15],
                    })
              );
            } else {
              setIcon(
                new Icon({
                  iconUrl: finish,
                  iconSize: [45, 45],
                  popupAnchor: [0, -15],
                })
              );
            }
          } else if (
            showTrainDetailsTrain.idZacetnaPostajaSZVlaka ==
            station.properties?.stationNumber
          ) {
            setIcon(
              themeMode
                ? new Icon({
                    iconUrl: start,
                    iconSize: [45, 45],
                    popupAnchor: [0, -15],
                  })
                : new Icon({
                    iconUrl: start,
                    iconSize: [45, 45],
                    popupAnchor: [0, -15],
                  })
            );
          } else {
            setIcon(
              themeMode
                ? new Icon({
                    iconUrl: lightModeFocus,
                    iconSize: [35, 35],
                    popupAnchor: [0, -15],
                  })
                : new Icon({
                    iconUrl: darkModeFocus,
                    iconSize: [35, 35],
                    popupAnchor: [0, -15],
                  })
            );
          }

          break;
        }
      }
      if (!isPart) {
        setStationIsPartOfTrainRoute(false);
      }
    }
  }, [allStopsOfTrain]);

  useEffect(() => {
    if (stationIsPartOfTrainRoute) {
      if (
        showTrainDetailsTrain.idKoncnaPostajaSZVlaka ==
        station.properties?.stationNumber
      ) {
        if (
          showTrainDetailsTrain.idTrenutnaPostajaVlaka ==
          station.properties?.stationNumber
        ) {
          setIcon(
            themeMode
              ? new Icon({
                  iconUrl: finishMoving,
                  iconSize: [60, 60],
                  popupAnchor: [0, -15],
                })
              : new Icon({
                  iconUrl: finishMovingDark,
                  iconSize: [60, 60],
                  popupAnchor: [0, -15],
                })
          );
        } else {
          setIcon(
            new Icon({
              iconUrl: finish,
              iconSize: [45, 45],
              popupAnchor: [0, -15],
            })
          );
        }
      } else if (
        showTrainDetailsTrain.idZacetnaPostajaSZVlaka ==
        station.properties?.stationNumber
      ) {
        setIcon(
          themeMode
            ? new Icon({
                iconUrl: start,
                iconSize: [45, 45],
                popupAnchor: [0, -15],
              })
            : new Icon({
                iconUrl: start,
                iconSize: [45, 45],
                popupAnchor: [0, -15],
              })
        );
      } else {
        setIcon(
          themeMode
            ? new Icon({
                iconUrl: lightModeFocus,
                iconSize: [35, 35],
                popupAnchor: [0, -15],
              })
            : new Icon({
                iconUrl: darkModeFocus,
                iconSize: [35, 35],
                popupAnchor: [0, -15],
              })
        );
      }
    } else {
      setIcon(
        themeMode
          ? new Icon({
              iconUrl: lightMode,
              iconSize: [35, 35],
              popupAnchor: [0, -15],
            })
          : new Icon({
              iconUrl: darkMode,
              iconSize: [35, 35],
              popupAnchor: [0, -15],
            })
      );
    }
  }, [themeMode]);

  const theme = useTheme();

  const [showPaper, setShowPaper] = useState(false);

  const handleMarkerClick = (stationNumber: number) => {
    if (activeMarker === stationNumber) {
    } else {
      setActiveMarker(stationNumber);
      setShowPaper(true);
    }
  };

  const handleClosePaperClick = () => {
    setShowPaper(false);
    setActiveMarker(null);
    if (trainsAtStation.length == 0 && !stationIsPartOfTrainRoute) {
      setIcon(
        themeMode
          ? new Icon({
              iconUrl: lightMode,
              iconSize: [35, 35],
              popupAnchor: [0, -15],
            })
          : new Icon({
              iconUrl: darkMode,
              iconSize: [35, 35],
              popupAnchor: [0, -15],
            })
      );
    }
  };

  const handleShowTrainDetails = (train: Train) => {
    const fetchData = async () => {
      try {
        const searchTrain = await axios.post(
          "http://localhost:3001/trains/refreshDetailsTrain",
          {
            dodeljenaStevilka: train.dodeljenaStevilkaVlaka,
            date: train.datumZacetkaVoznjeVlaka,
          }
        );

        setShowTrainDetailsTrain(searchTrain.data);
      } catch (error) {
        console.error("Trains could not be fetched", error);
      }
    };

    fetchData();
    setShowTrainDetails(true);
    setShowActiveTrains(false);
  };

  useEffect(() => {
    let newTrains: Train[] = [];
    let changeIcon = false;
    let theTrainWeTrack: Train = {} as Train;
    activeTrains.forEach((train) => {
      if (
        train.idTrenutnaPostajaVlaka == station.properties?.stationNumber &&
        train.statusVlaka != "zakljucil"
      ) {
        changeIcon = true;

        newTrains.push(train);
        if (
          train.dodeljenaStevilkaVlaka ==
          showTrainDetailsTrain.dodeljenaStevilkaVlaka
        ) {
          theTrainWeTrack = train;
        }
      }
    });
    setTrainsAtStation(newTrains);
    if (stationIsPartOfTrainRoute) {
      if (
        Object.keys(theTrainWeTrack).length > 0 &&
        theTrainWeTrack.idTrenutnaPostajaVlaka ==
          station.properties?.stationNumber
      ) {
        if (
          showTrainDetailsTrain.idKoncnaPostajaSZVlaka ==
          station.properties?.stationNumber
        ) {
          setIcon(
            themeMode
              ? new Icon({
                  iconUrl: finishMoving,
                  iconSize: [60, 60],
                  popupAnchor: [0, -15],
                })
              : new Icon({
                  iconUrl: finishMovingDark,
                  iconSize: [60, 60],
                  popupAnchor: [0, -15],
                })
          );
        } else {
          setIcon(
            themeMode
              ? new Icon({
                  iconUrl: movingImageFocus,
                  iconSize: [49, 49],
                  popupAnchor: [0, -15],
                })
              : new Icon({
                  iconUrl: movingImageDarkFocus,
                  iconSize: [49, 49],
                  popupAnchor: [0, -15],
                })
          );
        }
      } else {
        if (
          showTrainDetailsTrain.idKoncnaPostajaSZVlaka ==
          station.properties?.stationNumber
        ) {
          if (showTrainDetailsTrain.statusVlaka == "zakljucil") {
            setIcon(
              themeMode
                ? new Icon({
                    iconUrl: finishMoving,
                    iconSize: [60, 60],
                    popupAnchor: [0, -15],
                  })
                : new Icon({
                    iconUrl: finishMovingDark,
                    iconSize: [60, 60],
                    popupAnchor: [0, -15],
                  })
            );
          } else {
            setIcon(
              new Icon({
                iconUrl: finish,
                iconSize: [45, 45],
                popupAnchor: [0, -15],
              })
            );
          }
        } else if (
          showTrainDetailsTrain.idZacetnaPostajaSZVlaka ==
          station.properties?.stationNumber
        ) {
          setIcon(
            new Icon({
              iconUrl: start,
              iconSize: [45, 45],
              popupAnchor: [0, -15],
            })
          );
        } else {
          setIcon(
            themeMode
              ? new Icon({
                  iconUrl: lightModeFocus,
                  iconSize: [35, 35],
                  popupAnchor: [0, -15],
                })
              : new Icon({
                  iconUrl: darkModeFocus,
                  iconSize: [35, 35],
                  popupAnchor: [0, -15],
                })
          );
        }
      }
    } else {
      if (
        showActiveTrains &&
        changeIcon &&
        trainsAtStation.some(
          (train) =>
            train.statusVlaka === "aktiven" || train.statusVlaka === "neaktiven" //dodal sem tale some zbrisi ce kej narobe
        )
      ) {
        setIcon(
          themeMode
            ? new Icon({
                iconUrl: movingImage,
                iconSize: [49, 49],
                popupAnchor: [0, -15],
              })
            : new Icon({
                iconUrl: movingImageDark,
                iconSize: [49, 49],
                popupAnchor: [0, -15],
              })
        );
      } else if (!isHovered) {
        setIcon(
          themeMode
            ? new Icon({
                iconUrl: lightMode,
                iconSize: [35, 35],
                popupAnchor: [0, -15],
              })
            : new Icon({
                iconUrl: darkMode,
                iconSize: [35, 35],
                popupAnchor: [0, -15],
              })
        );
      }
    }
  }, [activeTrains]);

  useEffect(() => {
    if (
      searchStationValue?.label == station.properties?.name ||
      searchStationValue?.label == station.properties?.stationNumber.toString()
    ) {
      setActiveMarker(station.properties?.stationNumber);
      setShowPaper(true);
      if (!stationIsPartOfTrainRoute) {
        setIcon(
          themeMode
            ? new Icon({
                iconUrl: lightModeFocus,
                iconSize: [35, 35],
                popupAnchor: [0, -15],
              })
            : new Icon({
                iconUrl: darkModeFocus,
                iconSize: [35, 35],
                popupAnchor: [0, -15],
              })
        );
      }
      markerRef.current?.openPopup();
      map.flyTo(
        [station.geometry.coordinates[1], station.geometry.coordinates[0]],
        map.getMaxZoom()
      );
    }
  }, [searchStationValue]);

  useEffect(() => {
    if (!showActiveTrains && !stationIsPartOfTrainRoute) {
      let changeIcon = false;
      for (const train of activeTrains) {
        if (train.idTrenutnaPostajaVlaka == station.properties?.stationNumber) {
          changeIcon = true;
          break;
        }
      }
      if (changeIcon) {
        setIcon(
          themeMode
            ? new Icon({
                iconUrl: lightMode,
                iconSize: [35, 35],
                popupAnchor: [0, -15],
              })
            : new Icon({
                iconUrl: darkMode,
                iconSize: [35, 35],
                popupAnchor: [0, -15],
              })
        );
      }
    }
  }, [showActiveTrains]);

  return (
    <>
      <Marker
        ref={markerRef}
        riseOnHover={true}
        riseOffset={1500}
        position={[
          station.geometry.coordinates[1],
          station.geometry.coordinates[0],
        ]}
        icon={icon}
        eventHandlers={{
          mouseover: () => {
            setIsHovered(true);
            if (
              !stationIsPartOfTrainRoute &&
              (trainsAtStation.length == 0 || showActiveTrains == false)
            ) {
              setIcon(
                themeMode
                  ? new Icon({
                      iconUrl: lightModeFocus,
                      iconSize: [35, 35],
                      popupAnchor: [0, -15],
                    })
                  : new Icon({
                      iconUrl: darkModeFocus,
                      iconSize: [35, 35],
                      popupAnchor: [0, -15],
                    })
              );
            }
            markerRef.current?.openPopup();
          },
          mouseout: () => {
            setIsHovered(false);
            if (
              !stationIsPartOfTrainRoute &&
              (trainsAtStation.length == 0 || showActiveTrains == false)
            ) {
              setIcon(
                themeMode
                  ? new Icon({
                      iconUrl: lightMode,
                      iconSize: [35, 35],
                      popupAnchor: [0, -15],
                    })
                  : new Icon({
                      iconUrl: darkMode,
                      iconSize: [35, 35],
                      popupAnchor: [0, -15],
                    })
              );
            }
          },
          click: () => {
            handleMarkerClick(station.properties?.stationNumber);
          },
        }}
      >
        <Popup minWidth={1} closeButton={false}>
          {station.properties?.name}
        </Popup>
      </Marker>
      {showPaper && activeMarker === station.properties?.stationNumber && (
        <Paper
          elevation={5}
          sx={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: "tooltip",
            minWidth: "400px",
            width: "40vw",
            maxWidth: "90vw",
            maxHeight: "20vh",
            borderRadius: 0,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "1em",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#f1f1f1",
              borderRadius: "0px",
              boxShadow: "inset 0 0 6px rgba(0, 0, 0, 0.3)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "primary.light",
              borderRadius: "10px",
              border: "1px solid black",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "primary.main",
            },
          }}
        >
          <Container>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Container>
                <Box sx={{ mt: 1, display: "flex", flexDirection: "row" }}>
                  <Typography sx={{ mx: "auto" }} variant="h6">
                    {station.properties?.stationNumber} :
                    {" ".concat(station.properties?.name)}
                  </Typography>
                </Box>
              </Container>
              <Box>
                <IconButton
                  sx={{ position: "absolute", top: 2, right: 2 }}
                  onClick={handleClosePaperClick}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            <Box>
              <List>
                {trainsAtStation.map((train) => {
                  if (
                    train.statusVlaka != "zakljucil" &&
                    stationIsPartOfTrainRoute ===
                      (train.dodeljenaStevilkaVlaka ==
                        showTrainDetailsTrain.dodeljenaStevilkaVlaka)
                  ) {
                    return (
                      <Box key={train.dodeljenaStevilkaVlaka}>
                        {" "}
                        <Box
                          sx={{
                            borderBottom: "2px solid #015194",
                            borderRadius: "10px",
                            width: "100%",
                          }}
                        >
                          <Divider />
                        </Box>
                        <ListItem
                          disablePadding
                          key={train.dodeljenaStevilkaVlaka}
                        >
                          <ListItemButton
                            onClick={() => {
                              handleShowTrainDetails(train);
                            }}
                          >
                            <ListItemIcon>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: 180,
                                  ml: -5,
                                }}
                              >
                                {train.statusVlaka == "neaktiven" && (
                                  <Tooltip
                                    title={"Vlak neaktiven: ".concat(
                                      train.razlogNeaktivnostiVlaka
                                    )}
                                    slotProps={{
                                      popper: {
                                        modifiers: [
                                          {
                                            name: "offset",
                                            options: {
                                              offset: [0, -7],
                                            },
                                          },
                                        ],
                                      },
                                    }}
                                    arrow
                                    placement="top"
                                  >
                                    <Box
                                      component="img"
                                      sx={{
                                        height: 20,
                                        width: 20,
                                      }}
                                      src={neaktiven}
                                    />
                                  </Tooltip>
                                )}
                                {train.statusVlaka == "zakljucil" && (
                                  <Tooltip
                                    title={"Zaključil"}
                                    slotProps={{
                                      popper: {
                                        modifiers: [
                                          {
                                            name: "offset",
                                            options: {
                                              offset: [0, -7],
                                            },
                                          },
                                        ],
                                      },
                                    }}
                                    arrow
                                    placement="top"
                                  >
                                    <Box
                                      component="img"
                                      sx={{
                                        height: 18,
                                        width: 18,
                                        mb: 0.1,
                                      }}
                                      src={zakljucil}
                                    />
                                  </Tooltip>
                                )}
                                <Box>
                                  {train.tipVlaka == "redni" ? (
                                    <Chip
                                      avatar={
                                        <Avatar
                                          style={{
                                            backgroundColor:
                                              theme.palette.secondary.main,
                                          }}
                                          variant="rounded"
                                          src={redniVlak}
                                        />
                                      }
                                      label={train.dodeljenaStevilkaVlaka}
                                      color="secondary"
                                    />
                                  ) : (
                                    <Chip
                                      avatar={
                                        <Avatar
                                          style={{
                                            backgroundColor:
                                              theme.palette.secondary.main,
                                          }}
                                          variant="rounded"
                                          src={izredniVlak}
                                        />
                                      }
                                      label={train.dodeljenaStevilkaVlaka}
                                      color="secondary"
                                    />
                                  )}
                                </Box>

                                <Box
                                  component="img"
                                  sx={{
                                    height: 26,
                                    width: 26,
                                  }}
                                  src={arrows4}
                                />
                                <Box>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    {train.nazivKoncnePostaje}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography>
                                    {train.zamudaVlaka < 0
                                      ? train.zamudaVlaka.toString()
                                      : "+".concat(
                                          train.zamudaVlaka.toString()
                                        )}
                                  </Typography>
                                </Box>
                              </Box>
                            </ListItemIcon>
                            <ListItemText>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",

                                  ml: 2,
                                }}
                              >
                                <Box sx={{ mb: 1 }}>
                                  <Typography sx={{ fontWeight: "bold" }}>
                                    Prejšnja postaja:
                                  </Typography>
                                  <Typography>
                                    {train.nazivPrejsnjePostaje == null
                                      ? train.nazivZacetnePostaje
                                      : train.nazivPrejsnjePostaje}
                                  </Typography>
                                </Box>
                                <Divider></Divider>
                                <Box sx={{ mt: 1 }}>
                                  <Typography sx={{ fontWeight: "bold" }}>
                                    Naslednja postaja:
                                  </Typography>
                                  <Typography>
                                    {train.nazivNaslednjePostaje == null
                                      ? train.nazivKoncnePostaje
                                      : train.nazivNaslednjePostaje}
                                  </Typography>
                                </Box>
                              </Box>
                            </ListItemText>
                          </ListItemButton>
                        </ListItem>
                      </Box>
                    );
                  }
                })}
              </List>
            </Box>
          </Container>
        </Paper>
      )}
    </>
  );
};

export default Station;
