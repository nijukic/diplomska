import { useContext, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import arrows4 from "../assets/down-arrowLarge.png";
import neaktiven from "../assets/neaktiven.png";
import rid from "../assets/RID.png";
import vagonSlika from "../assets/wagon.png";
import redniVlak from "../assets/redniVlak.png";
import izredniVlak from "../assets/izredniVlak.png";
import zakljucil from "../assets/accept.png";
import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Checkbox,
  Grid,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Chip,
  Avatar,
  ListItemText,
  Tooltip,
  RadioGroup,
  Radio,
} from "@mui/material";

import { blue, red } from "@mui/material/colors";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import axios from "axios";
import { useTheme } from "@mui/material/styles";
import { AuthContext } from "../helpers/AuthContext";

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

interface Wagon {
  VIVidVagona: number;
  RIDTovoraVagona: boolean;
  stevilkaTovornegaListaVagona: number;
  stevilkaPosiljkeVagona: number;
  stevilkaPogodbeVagona: number;
  netoTezaVagona: number;
  dostavljenVagon: boolean;
  idStrankeVagona: number;
  kodaNHMVagona: number;
  odpravnaDrzavaVagona: number;
  namembnaDrzavaVagona: number;
  naslednjiPrevoznikVagona: number;
  nazivPrevoznika: string;
  taraVagona: number;
  lastnistvoVagona: string;
  serijaVagona: string;
  opisNHM: string;
  nazivOdpravneDrzave: string;
  nazivNamembneDrzave: String;
  VIVdodeljenaStevilkaVlaka: number;
  VIVdatumZacetkaVoznjeVlaka: string;
  idTrenutnaPostajaVlaka: number;
  nazivPostaje: string;
}

interface Props {
  activeTrains: Train[];
  activeMarker: number | null;
  setActiveMarker: (value: number | null) => void;
  setShowTrainDetails: (value: boolean) => void;
  setShowTrainDetailsTrain: (value: Train) => void;
  setShowActiveTrains: (value: boolean) => void;
  setSearchStationValue: (value: searchStation) => void;
}

interface searchTrain {
  label: string;
  dodatno: string;
}

interface searchStation {
  label: string;
  dodatno: string;
}

export default function CornerTab({
  activeTrains,
  setShowTrainDetails,
  setShowTrainDetailsTrain,
  setShowActiveTrains,
  setSearchStationValue,
}: Props) {
  const { vlogaUporabnika, idStrankeUporabnika } = useContext(AuthContext);
  const [value, setValue] = useState(vlogaUporabnika != "stranka" ? "1" : "2");
  const [statusVlaka, setStatusVlaka] = useState("aktiven");
  const [tipVlaka, setTipVlaka] = useState(false);
  const [searchTrainValue, setSearchTrainValue] = useState<searchTrain | null>(
    null
  );

  const [valueDatePicker, setValueDatePicker] = useState<Dayjs | null>(dayjs());

  const [searchBarTrainOptions, setSearchBarTrainOptions] = useState<Train[]>(
    []
  );

  const theme = useTheme();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const hasInitialized = useRef(false);

  const [typeOfDocument, setTypeOfDocument] = useState(
    vlogaUporabnika != "stranka"
      ? "idStrankeVagona"
      : "stevilkaTovornegaListaVagona"
  );
  const [searchDocumentValue, setSearchDocumentValue] = useState<string | null>(
    null
  );
  const [searchBarDocumentOptions, setSearchBarDocumentOptions] = useState<
    string[]
  >([]);

  const [searchWagonValue, setSearchWagonValue] = useState<string | null>(null);
  const [searchBarWagonOptions, setSearchBarWagonOptions] = useState<string[]>(
    []
  );

  const [searchWagons, setSearchWagons] = useState<Wagon[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchTrains = await axios.post(
          "http://localhost:3001/trains/searchTrains",
          {
            status: statusVlaka,
            type: tipVlaka,
            date: valueDatePicker?.format("YYYY-MM-DD"),
          }
        );
        setSearchBarTrainOptions(searchTrains.data);
      } catch (error) {
        console.error("Trains could not be fetched", error);
      }
    };

    fetchData();
  }, [statusVlaka, tipVlaka, valueDatePicker]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchTrain = await axios.post(
          "http://localhost:3001/trains/searchSpecificTrain",
          {
            dodeljenaStevilka: searchTrainValue?.label,
            date: valueDatePicker?.format("YYYY-MM-DD"),
          }
        );
        setSearchBarTrainOptions(searchTrain.data);
      } catch (error) {
        console.error("Trains could not be fetched", error);
      }
    };

    fetchData();
  }, [searchTrainValue]);

  useEffect(() => {
    if (!hasInitialized.current && activeTrains.length > 0) {
      setSearchBarTrainOptions(activeTrains);
      hasInitialized.current = true;
    }
  }, [activeTrains]);

  const handleClear = () => {
    const fetchData = async () => {
      try {
        const searchTrains = await axios.post(
          "http://localhost:3001/trains/searchTrains",
          {
            status: statusVlaka,
            type: tipVlaka,
            date: valueDatePicker?.format("YYYY-MM-DD"),
          }
        );
        setSearchBarTrainOptions(searchTrains.data);
      } catch (error) {
        console.error("Trains could not be fetched", error);
      }
    };

    fetchData();
  };

  const handleShowTrainDetails = (
    dodeljenaStevilka: number,
    datumZacetkaVoznjeVlaka: string,
    idTrenutnaPostajaVlaka: number,
    nazivPostaje: string
  ) => {
    const fetchData = async () => {
      try {
        const searchTrain = await axios.post(
          "http://localhost:3001/trains/refreshDetailsTrain",
          {
            dodeljenaStevilka: dodeljenaStevilka,
            date: datumZacetkaVoznjeVlaka,
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
    setSearchStationValue({
      label: idTrenutnaPostajaVlaka.toString(),
      dodatno: nazivPostaje,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const documentNumbers = await axios.post(
          "http://localhost:3001/document/getDocumentNumbers",
          {
            type: typeOfDocument,
            idStrankeUporabnika: idStrankeUporabnika,
          }
        );
        setSearchBarDocumentOptions(
          documentNumbers.data.map((item: { label: string }) => item.label)
        );
      } catch (error) {
        console.error("Document numbers could not be fetched", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wagonNumbers = await axios.post(
          "http://localhost:3001/wagon/getWagonNumbers",
          { idStrankeUporabnika: idStrankeUporabnika }
        );
        setSearchBarWagonOptions(
          wagonNumbers.data.map((item: { label: string }) => item.label)
        );
      } catch (error) {
        console.error("Document numbers could not be fetched", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const documentNumbers = await axios.post(
          "http://localhost:3001/document/getDocumentNumbers",
          {
            type: typeOfDocument,
            idStrankeUporabnika: idStrankeUporabnika,
          }
        );
        setSearchBarDocumentOptions(
          documentNumbers.data.map((item: { label: string }) => item.label)
        );
      } catch (error) {
        console.error("Document numbers could not be fetched", error);
      }
    };

    fetchData();
  }, [typeOfDocument]);

  useEffect(() => {
    const fetchData = async () => {
      if (searchDocumentValue != null) {
        try {
          const searchWagons = await axios.post(
            "http://localhost:3001/wagon/searchWagons",
            {
              type: typeOfDocument,
              documentNumber: searchDocumentValue,
            }
          );
          setSearchWagons(searchWagons.data);
        } catch (error) {
          console.error("Wagons could not be fetched", error);
        }
      }
    };

    fetchData();
  }, [searchDocumentValue]);

  useEffect(() => {
    const fetchData = async () => {
      if (searchWagonValue != null) {
        try {
          const searchWagons = await axios.post(
            "http://localhost:3001/wagon/searchWagonsById",
            {
              wagonNumber: searchWagonValue,
            }
          );
          setSearchWagons(searchWagons.data);
        } catch (error) {
          console.error("Wagons could not be fetched", error);
        }
      }
    };

    fetchData();
  }, [searchWagonValue]);

  useEffect(() => {
    const fetchData = async () => {
      if (vlogaUporabnika == "stranka") {
        try {
          const searchWagons = await axios.post(
            "http://localhost:3001/wagon/getCustomerWagons",
            { idStrankeUporabnika: idStrankeUporabnika }
          );
          setSearchWagons(searchWagons.data);
        } catch (error) {
          console.error("Wagons could not be fetched", error);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList centered onChange={handleChange}>
            {vlogaUporabnika != "stranka" && <Tab label="Vlaki" value="1" />}
            <Tab label="Vagoni" value="2" />
          </TabList>
        </Box>
        {vlogaUporabnika != "stranka" && (
          <TabPanel value="1">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Autocomplete
                  onChange={(
                    event: any,
                    newValue: searchTrain | null,
                    reason: string
                  ) => {
                    if (reason == "clear") {
                      handleClear();
                    } else {
                      setSearchTrainValue(newValue);
                    }
                  }}
                  disablePortal
                  id="searchBarTrain"
                  options={searchBarTrainOptions.map((train) => ({
                    label: train.dodeljenaStevilkaVlaka.toString(),
                    dodatno: "za ".concat(train.nazivKoncnePostaje),
                  }))}
                  isOptionEqualToValue={(option, value) =>
                    option.label === value.label &&
                    option.dodatno === value.dodatno
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
                      label="Številka vlaka"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "off",
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={5} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="statusVlaka">Status vlaka</InputLabel>
                  <Select
                    labelId="statusVlaka"
                    id="statusVlaka"
                    value={statusVlaka}
                    label="statusVlaka"
                    onChange={(event) => {
                      setStatusVlaka(event.target.value);
                    }}
                  >
                    <MenuItem value={"aktiven"}>aktiven</MenuItem>
                    <MenuItem value={"neaktiven"}>neaktiven</MenuItem>
                    <MenuItem value={"zakljucil"}>zaključil</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={7} md={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid gray",
                    borderRadius: 1,
                    width: "80px",
                    justifyContent: "center",
                    position: "relative",
                    backgroundColor: tipVlaka ? red[400] : "primary.main",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        disableRipple
                        icon={
                          <img
                            src={redniVlak}
                            alt="unchecked"
                            style={{ width: 24, height: 24, marginTop: -5 }}
                          />
                        }
                        checkedIcon={
                          <img
                            src={izredniVlak}
                            alt="checked"
                            style={{ width: 24, height: 24, marginTop: -5 }}
                          />
                        }
                        sx={{
                          color: blue[900],
                          "&.Mui-checked": {
                            color: red[900],
                          },
                        }}
                        checked={tipVlaka}
                        onChange={(event) => {
                          setTipVlaka(event.target.checked);
                        }}
                      />
                    }
                    label={tipVlaka ? "IZREDNI" : "REDNI"}
                    labelPlacement="bottom"
                    sx={{
                      ml: 2,
                      "& .MuiFormControlLabel-label": {
                        mt: -1,
                      },
                      color: "white",
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Datum vlakovne poti"
                    value={valueDatePicker}
                    onChange={(newValue) => {
                      setValueDatePicker(newValue);
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={12}>
                <Divider sx={{ mt: 2, border: "2px solid lightgray" }} />
              </Grid>
              <Grid item xs={12} md={12}>
                <Box>
                  <List>
                    {searchBarTrainOptions.map((train) => {
                      return (
                        <Box key={train.dodeljenaStevilkaVlaka}>
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
                              onClick={() =>
                                handleShowTrainDetails(
                                  train.dodeljenaStevilkaVlaka,
                                  train.datumZacetkaVoznjeVlaka,
                                  train.idTrenutnaPostajaVlaka,
                                  train.nazivPostaje
                                )
                              }
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
                    })}
                    <Box
                      sx={{
                        borderBottom: "2px solid #015194",
                        borderRadius: "10px",
                        width: "100%",
                      }}
                    >
                      <Divider />
                    </Box>
                  </List>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>
        )}
        <TabPanel value="2">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} alignItems="center">
              <Autocomplete
                disablePortal
                value={searchWagonValue}
                onChange={(
                  event: any,
                  newValue: string | null,
                  reason: string
                ) => {
                  if (reason === "clear") {
                    setSearchWagonValue(null);
                  } else {
                    setSearchWagonValue(newValue);
                  }
                }}
                options={searchBarWagonOptions}
                renderInput={(params) => (
                  <TextField {...params} label="Številka vagona" />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6} alignItems="center">
              <Autocomplete
                disablePortal
                value={searchDocumentValue}
                onChange={(
                  event: any,
                  newValue: string | null,
                  reason: string
                ) => {
                  if (reason === "clear") {
                    setSearchDocumentValue(null);
                  } else {
                    setSearchDocumentValue(newValue);
                  }
                }}
                options={searchBarDocumentOptions}
                renderInput={(params) => (
                  <TextField {...params} label="Številka dokumenta" />
                )}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControl>
                <RadioGroup
                  row
                  value={typeOfDocument}
                  onChange={(event) => {
                    setTypeOfDocument(event.target.value);
                    setSearchDocumentValue(null);
                  }}
                >
                  {vlogaUporabnika != "stranka" && (
                    <FormControlLabel
                      value="idStrankeVagona"
                      control={<Radio />}
                      label="Št. stranke"
                    />
                  )}

                  <FormControlLabel
                    value="stevilkaTovornegaListaVagona"
                    control={<Radio />}
                    label="Tovorni list"
                  />
                  <FormControlLabel
                    value="stevilkaPosiljkeVagona"
                    control={<Radio />}
                    label="Št. pošiljke"
                  />
                  <FormControlLabel
                    value="stevilkaPogodbeVagona"
                    control={<Radio />}
                    label="Št. pogodbe"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12}>
              <Divider sx={{ border: "2px solid lightgray" }} />
            </Grid>
            <Grid item xs={12} md={12}>
              <Box>
                <List>
                  <Box
                    sx={{
                      borderBottom: "5px solid #015194",
                      borderRadius: "10px",
                      width: "100%",
                    }}
                  >
                    <Divider />
                  </Box>
                  {searchWagons.map((wagon) => {
                    return (
                      <Box key={wagon.VIVidVagona}>
                        <ListItem disablePadding>
                          <ListItemButton
                            onClick={() =>
                              handleShowTrainDetails(
                                wagon.VIVdodeljenaStevilkaVlaka,
                                wagon.VIVdatumZacetkaVoznjeVlaka,
                                wagon.idTrenutnaPostajaVlaka,
                                wagon.nazivPostaje
                              )
                            }
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
                                {wagon.dostavljenVagon == true && (
                                  <Tooltip
                                    title={"Dostavljen"}
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
                                        mb: 0.2,
                                      }}
                                      src={zakljucil}
                                    />
                                  </Tooltip>
                                )}
                                <Box>
                                  <Chip
                                    avatar={
                                      <Avatar
                                        variant="rounded"
                                        src={vagonSlika}
                                      />
                                    }
                                    label={
                                      <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: "bold" }}
                                      >
                                        {wagon.VIVidVagona}
                                      </Typography>
                                    }
                                    variant="outlined"
                                    sx={{
                                      borderWidth: 3,
                                      borderColor: "primary.main",
                                    }}
                                  />
                                </Box>
                                <Box>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ mt: 1, fontWeight: "bold" }}
                                  >
                                    {wagon.lastnistvoVagona == "zelezniski"
                                      ? "Slovenske železnice"
                                      : "Privatnik"}
                                  </Typography>
                                </Box>
                                <Box>
                                  {wagon.RIDTovoraVagona == true && (
                                    <Tooltip
                                      title="Nevarni tovor"
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
                                    >
                                      <Box
                                        component="img"
                                        sx={{
                                          height: 20,
                                          width: 20,
                                        }}
                                        src={rid}
                                      />
                                    </Tooltip>
                                  )}
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
                                <Box sx={{ mb: 2 }}>
                                  <Grid container spacing={2}>
                                    <Grid item xs={6} sm={6} md={6} lg={3}>
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                      >
                                        <strong>Tov. list:</strong>
                                      </Typography>
                                      <Typography variant="body2">
                                        {wagon.stevilkaTovornegaListaVagona}
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={6} sm={6} md={6} lg={3}>
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                      >
                                        <strong>Pošiljka:</strong>
                                      </Typography>
                                      <Typography variant="body2">
                                        {wagon.stevilkaPosiljkeVagona}
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={6} sm={6} md={6} lg={3}>
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                      >
                                        <strong>Pogodba:</strong>
                                      </Typography>
                                      <Typography variant="body2">
                                        {wagon.stevilkaPogodbeVagona}
                                      </Typography>
                                    </Grid>

                                    <Grid item xs={6} sm={6} md={6} lg={3}>
                                      <Typography
                                        variant="body2"
                                        color="textSecondary"
                                      >
                                        <strong>Stranka:</strong>
                                      </Typography>
                                      <Typography variant="body2">
                                        {wagon.idStrankeVagona}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Box>

                                <Divider sx={{ borderColor: "#ddd", mb: 2 }} />

                                <Box sx={{ mb: 2 }}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      mb: 1,
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle1"
                                      sx={{ fontWeight: "bold", mr: 1 }}
                                    >
                                      Koda NHM:
                                    </Typography>
                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        fontWeight: "bold",
                                        color: "primary.main",
                                      }}
                                    >
                                      {wagon.kodaNHMVagona}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                  >
                                    {wagon.opisNHM}
                                  </Typography>
                                </Box>
                              </Box>
                            </ListItemText>
                          </ListItemButton>
                        </ListItem>
                        <Box
                          sx={{
                            borderBottom: "5px solid #015194",
                            borderRadius: "10px",
                            width: "100%",
                          }}
                        >
                          <Divider />
                        </Box>
                      </Box>
                    );
                  })}
                </List>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
