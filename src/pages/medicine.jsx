import React, { useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';

import {
  MDBNavbar,
  MDBModal,
  MDBModalDialog,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBModalContent,
  MDBModalTitle,
} from "mdb-react-ui-kit";

import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Divider,
  Paper,
  IconButton,
  Button,
  Autocomplete,
  MenuItem,
  ListSubheader,
  Menu,
  Box ,
  Tab,
  TextField,
  Backdrop,
  CircularProgress
} from '@mui/material';

import{
  TabContext,
  TabList,
  TabPanel,
} from '@mui/lab';

import {
  Search,
  LocationOn,
  ArrowDropDownCircle
} from '@mui/icons-material';

import axios from '../config/server.config';

export default function Medicine(props) {
  //interface
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [which, setWhich] = React.useState(null);
  const [modalOpen,setModalOpen] = React.useState(false);
  const [modaldata,setModalData] = React.useState(false);
  const [modalsendtype,setModalSendType] = React.useState('email');
  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState('1');
  
  //zipcode
  const [focuseZipcode,setFocusZipcode] = React.useState(false);
  const [zipdata, setZipdata] = React.useState({city:'',zip_code:77084});
  const [tmp_zipcode, setTmpZipcode] = React.useState('');

  //dynamic datas
  const [popularMedicineData, setPopularMedicines] = React.useState([]);
  const [medicineData, setMedicines] = React.useState([]);
  const [drugData, setDrugs] = React.useState([]);
  const [pharmacyData,setPharmacies] = React.useState([]);
  const [mainData,setMainData] = React.useState([]);
  const [brand, setBrand] = React.useState(0);
  const [form, setForm] = React.useState(0);
  const [dosage, setDosage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(0);

  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const params = useParams();

  const fetchData = async () => {
    await axios
    .get('v1/drugs-by-seo-name/'+params.medicine)
    .then(function(res){
      setMainData(res.data);
      axios
      .get('v1/drug/'+res.data[0].Value[0].Value[0].Value[0].Value.NDC)
      .then(function(drugRes){
        setDrugs(drugRes.data);
        axios
        .get('v1/price/'+res.data[0].Value[0].Value[0].Value[0].Value.NDC+'/'+res.data[0].Value[0].Value[0].Value[0].Key+'/'+zipdata.zip_code)
        .then(function(PharRes){
          setPharmacies(PharRes.data);
        });
      });
    });

    await axios
    .get('v1/popular')
    .then(function(res){
      setPopularMedicines(res.data.popular_now);
      setMedicines(res.data.popular_now);
      setLoading(false);
    });
  }

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  const setSearchResult = (e,val) =>{
    if(val == ""){
      setMedicines(popularMedicineData);
    }else{
      axios
      .get('v1/search?q='+e.target.value)
      .then(function(res){
        setMedicines(res.data);
      });
    }
  }

  const handleClick = (event,which) => {
    setAnchorEl(event.currentTarget);
    setWhich(which);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formatData = () =>{
    setBrand(0);
    setForm(0);
    setDosage(0);
    setQuantity(0);
  }

  const changeBrand = (val) =>{
    setLoading(true);
    handleClose();
    setBrand(val);
    setForm(0);
    setDosage(0);
    setQuantity(0);
    axios
    .get('v1/price/'+mainData[brand].Value[0].Value[0].Value[0].Value.NDC+'/'+mainData[brand].Value[0].Value[0].Value[0].Key+'/'+zipdata.zip_code)
    .then(function(PharRes){
      setPharmacies(PharRes.data);
      setLoading(false);
    });
  }
  const changeForm = (val) =>{
    setLoading(true);
    handleClose();
    setForm(val);
    setDosage(0);
    setQuantity(0);
    axios
    .get('v1/price/'+mainData[brand].Value[val].Value[0].Value[0].Value.NDC+'/'+mainData[brand].Value[val].Value[0].Value[0].Key+'/'+zipdata.zip_code)
    .then(function(PharRes){
      setPharmacies(PharRes.data);
      setLoading(false);
    });
  }
  const changeDosage = (val) =>{
    setLoading(true);
    handleClose();
    setDosage(val);
    setQuantity(0);
    axios
    .get('v1/price/'+mainData[brand].Value[form].Value[val].Value[0].Value.NDC+'/'+mainData[brand].Value[form].Value[val].Value[0].Key+'/'+zipdata.zip_code)
    .then(function(PharRes){
      setPharmacies(PharRes.data);
      setLoading(false);
    });
  }
  const changeQuantity = (val) =>{
    setLoading(true);
    handleClose();
    setQuantity(val);
    axios
    .get('v1/price/'+mainData[brand].Value[form].Value[dosage].Value[val].Value.NDC+'/'+mainData[brand].Value[form].Value[dosage].Value[val].Key+'/'+zipdata.zip_code)
    .then(function(PharRes){
      setPharmacies(PharRes.data);
      setLoading(false);
    });
  }

  const tabChange = (event,newValue) => {
    setValue(newValue);
  };

  const print = () =>{

  }

  const changeZipcode = (e) =>{
    setTmpZipcode(e.target.value);
    if(e.target.value.length == 5){
      setLoading(true);
      axios.get('v1/zip_code/'+e.target.value).then(function(res){
        setFocusZipcode(false);
        setZipdata(res.data);
        formatData();
        fetchData();
      })
    }
  }

  const setZipcode = () =>{
    setTmpZipcode(zipdata.zip_code);
    setFocusZipcode(true);
  }
  
  const setModal = (data) =>{
    setModalOpen(true);
    setModalData(data);
  }
  
  const goDetail = (e,val) =>{
    console.log(val);
    setLoading(true);
    formatData();
    navigate("/virtualme/"+val.seo_name);
    const fetchData = async() =>{
      await axios
      .get('v1/drugs-by-seo-name/'+val.seo_name)
      .then(function(res){
        setMainData(res.data);
        axios
        .get('v1/drug/'+res.data[0].Value[0].Value[0].Value[0].Value.NDC)
        .then(function(drugRes){
          setDrugs(drugRes.data);
          axios
          .get('v1/price/'+res.data[0].Value[0].Value[0].Value[0].Value.NDC+'/'+res.data[0].Value[0].Value[0].Value[0].Key+'/'+zipdata.zip_code)
          .then(function(PharRes){
            setPharmacies(PharRes.data);
            setLoading(false);
          });
        });
      });
    }
    fetchData();
  }

  const ready = mainData.length == 0 ? false : true;

  return (
    <>
      <MDBNavbar className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className="collapse navbar-collapse">
            <a className="navbar-brand py-2 px-1" href="#">
              <img
                src="../logo.png"
                height="23"
                alt="MDB Logo"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </MDBNavbar>

      <Grid container direction={"row"} justifyContent={"center"} alignItems={"center"} className="py-5 px-1 section2_1">
        <Grid item container xs={12} sm={9} md={6}  direction={"column"} alignItems={"center"} justifyContent={"center"}>
          <Grid item container spacing={2} direction={"row"} alignItems={"center"} justifyContent={"center"} className="mt-2">
              <Grid item md={4}>
                <Paper
                  className='p-2'
                  sx={{  display: 'flex', alignItems: 'center' }}
                >
                  <Grid container direction={"row"}  justifyContent={"center"} alignItems={"center"}>
                    <Grid item>
                      <IconButton aria-label="menu">
                        <LocationOn />
                      </IconButton>
                    </Grid>
                    <Grid item md={10} className='searchBox'>
                      {focuseZipcode == true ?
                        <TextField 
                          fullWidth 
                          size={"small"} 
                          autoFocus={focuseZipcode} 
                          variant="standard" 
                          onBlur={() =>setFocusZipcode(false)} 
                          onChange={(e) =>changeZipcode(e)} 
                          value={tmp_zipcode}
                        />
                        :
                        <Button fullWidth onClick={() =>setZipcode()}>{''+zipdata.city}</Button>
                      }
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item md={8}>
                <Paper
                  className='p-2'
                  sx={{  display: 'flex', alignItems: 'center' }}
                >
                  <Grid container direction={"row"}  justifyContent={"space-between"} alignItems={"center"}>
                    <Grid item>
                      <IconButton aria-label="menu">
                        <Search />
                      </IconButton>
                    </Grid>
                    <Grid item md={8} className='searchBox p-1 m-1'>
                      <Autocomplete
                        sx={{
                          display: 'block',
                          '& input': {
                            width: '100%',
                            border:'none',
                            bgcolor: 'background.paper',
                            color: (theme) =>
                              theme.palette.getContrastText(theme.palette.background.paper),
                          },
                        }}
                        options={medicineData}
                        onInputChange={(e,val) =>setSearchResult(e,val)}
                        onChange={(e,val) => goDetail(e,val)}
                        onBlur={() =>setMedicines(popularMedicineData)}
                        getOptionLabel={option => option.display_name}

                        renderInput={(params) => (
                          <div ref={params.InputProps.ref}>
                            <input type="text" placeholder='Search prescriptions' {...params.inputProps} />
                          </div>
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <Button variant="outlined">Search</Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
          </Grid>
          <Grid item container direction={"column"} alignItems={"center"} justifyContent={"center"} className="mt-2">
            <Grid item container md={12} alignItems={"center"} justifyContent={"center"}>
                <Grid item>
                    <Paper className='p-2'>
                      <h2>{ready && mainData[brand].Value[form].Value[dosage].Value[quantity].Value.MetaTitle}</h2>
                      <p>{ready && mainData[brand].Value[form].Value[dosage].Value[quantity].Value.Description}</p>
                      <Divider />
                      <Grid container direction={"row"} columnSpacing={2} className="p-2" alignItems={"center"} justifyContent={"flex-start"}>
                          <Grid item>
                            <label>{ready && mainData[brand].Key}</label>
                            <IconButton
                              onClick={(e) =>handleClick(e,1)}
                              aria-controls={open && which == 1 && which == 1 ? 'menu1' : undefined}
                              aria-haspopup="true"
                              aria-expanded={open && which == 1 && which == 1 ? 'true' : undefined}
                            >
                              <ArrowDropDownCircle />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              id="menu1"
                              open={open && which == 1}
                              onClose={handleClose}
                              onClick={handleClose}
                              PaperProps={{
                                elevation: 0,
                                sx: {
                                  overflow: 'visible',
                                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                  mt: 1.5,
                                  '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                  },
                                },
                              }}
                              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                              <ListSubheader>Select Brand</ListSubheader>
                              {
                                ready &&
                                mainData.map((brand,index)=>{
                                  return <MenuItem key={index} onClick={() =>changeBrand(index)}>
                                    {brand.Key}
                                  </MenuItem>
                                })
                              }
                            </Menu>
                          </Grid>
                          <Grid item>
                            <label>{ready && mainData[brand].Value[form].Key}</label>
                            <IconButton
                              onClick={(e) =>handleClick(e,2)}
                              aria-controls={open && which == 2 ? 'menu2' : undefined}
                              aria-haspopup="true"
                              aria-expanded={open && which == 2 ? 'true' : undefined}
                            >
                              <ArrowDropDownCircle />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              id="menu2"
                              open={open && which == 2}
                              onClose={handleClose}
                              onClick={handleClose}
                              PaperProps={{
                                elevation: 0,
                                sx: {
                                  overflow: 'visible',
                                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                  mt: 1.5,
                                  '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                  },
                                },
                              }}
                              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            > 
                              <ListSubheader>Select Form</ListSubheader>
                              {
                                ready &&
                                mainData[brand].Value.map((form,index)=>{
                                  return <MenuItem key={index} onClick={() =>changeForm(index)}>
                                    {form.Key}
                                  </MenuItem>
                                })
                              }
                            </Menu>
                          </Grid>
                          <Grid item>
                            <label>{ready && mainData[brand].Value[form].Value[dosage].Key}</label>
                            <IconButton
                              onClick={(e) =>handleClick(e,3)}
                              aria-controls={open && which == 3 ? 'menu3' : undefined}
                              aria-haspopup="true"
                              aria-expanded={open && which == 3 ? 'true' : undefined}
                            >
                              <ArrowDropDownCircle />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              id="menu3"
                              open={open && which == 3}
                              onClose={handleClose}
                              onClick={handleClose}
                              PaperProps={{
                                elevation: 0,
                                sx: {
                                  overflow: 'visible',
                                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                  mt: 1.5,
                                  '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                  },
                                },
                              }}
                              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            > 
                              <ListSubheader>Select Dosage</ListSubheader>
                              {
                                ready &&
                                mainData[brand].Value[form].Value.map((dosage,index)=>{
                                  return <MenuItem key={index} onClick={() =>changeDosage(index)}>
                                    {dosage.Key}
                                  </MenuItem>
                                })
                              }
                            </Menu>
                          </Grid>
                          <Grid item>
                            <label>{ready && mainData[brand].Value[form].Value[dosage].Value[quantity].Key + "Count"}</label>
                            <IconButton
                              onClick={(e) =>handleClick(e,4)}
                              aria-controls={open && which == 4 ? 'menu4' : undefined}
                              aria-haspopup="true"
                              aria-expanded={open && which == 4 ? 'true' : undefined}
                            >
                              <ArrowDropDownCircle />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              id="menu4"
                              open={open && which == 4}
                              onClose={handleClose}
                              onClick={handleClose}
                              PaperProps={{
                                elevation: 0,
                                sx: {
                                  overflow: 'visible',
                                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                  mt: 1.5,
                                  '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                  },
                                },
                              }}
                              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            > 
                              <ListSubheader>Select Quantity</ListSubheader>
                              {
                                ready &&
                                mainData[brand].Value[form].Value[dosage].Value.map((quantity,index)=>{
                                  return <MenuItem key={index} onClick={() =>changeQuantity(index)}>
                                    {quantity.Key}
                                  </MenuItem>
                                })
                              }
                            </Menu>
                          </Grid>
                      </Grid>
                    </Paper>
                </Grid>             
            </Grid>
          </Grid>
          <Grid item container direction={"column"} alignItems={"center"} justifyContent={"center"} className="mt-2">
          {
            pharmacyData.PharmacyPricings && pharmacyData.PharmacyPricings.map((pharmacy,index)=>{
              return <Grid item sx={{width:'100%'}} className="mt-2">
                <Paper elevation={3} className="p-4">
                  <Grid container direction={"row"}>
                    <Grid item container direciton={"row"} alignItems={"center"} justifyContent={"space-between"}  md={4}>
                      <Grid item sx={{width:'120px'}}>
                        <img src={pharmacy.Pharmacy && pharmacy.Pharmacy.LogoUrl} alt="No Image" />
                      </Grid>
                      <Grid item>
                        {pharmacy.Pharmacy && parseFloat(pharmacy.Pharmacy.Distance).toFixed(2) + "miles"}
                      </Grid>
                    </Grid>
                    <Grid item container direciton={"row"} alignItems={"center"} justifyContent={"flex-end"}  md={8}>
                      <Grid item>
                        <h4 className="p-2 m-1">${pharmacy.Prices && pharmacy.Prices[0].Price}</h4>
                      </Grid>
                      <Grid item>
                        <Button  variant="contained" className="py-3" color="success" onClick={() =>setModal({name:'amoxicillin', description:'21 capsule, 500mg for %5.63 at kronger Pharmacy'})}>Get Free Coupon</Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            })
          }
          </Grid>
        </Grid>
      </Grid>
      
      <Grid container direction={"row"} justifyContent={"center"} alignItems={"center"} className="py-5 px-1 section2_2">
        <Grid item container xs={12} sm={9} md={6}   direction={"column"} alignItems={"center"} justifyContent={"center"}>
          <Grid item>
            <h3>SingleCare partners with major pharmacies</h3>
          </Grid>
          <Grid item container direction={"row"} alignItems={"center"} justifyContent={"center"}>
            <Grid item>
              <svg className='cvs'/>
            </Grid>
            <Grid item>
            <svg className='target' />
            </Grid>
            <Grid item>
            <svg className='longs' />
            </Grid>
          </Grid>
          <Grid item container direction={"row"} alignItems={"center"} justifyContent={"center"}>
            <Grid item>
              <svg className='walmart'/>
            </Grid>
            <Grid item>
            <svg className='kronger' />
            </Grid>
            <Grid item>
            <svg className='frys' />
            </Grid>
          </Grid>
          <Grid item container direction={"row"} alignItems={"center"} justifyContent={"center"}>
            <Grid item>
              <svg className='harristeeter'/>
            </Grid>
            <Grid item>
            <svg className='walgreens' />
            </Grid>
            <Grid item>
            <svg className='duanereade' />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container direction={"row"} justifyContent={"center"} alignItems={"center"} className="py-5 px-1 section2_3">
        <Grid item container xs={12} sm={9} md={6}  direction={"column"} justifyContent={"center"} alignItems={"center"} >
          <Grid item md={4} className="mb-2">
            <Box>HOW TO GET THE MOST FROM YOUR AMOXICILLIN COUPON</Box>
          </Grid>
          {
            drugData.length !== 0 && drugData.FAQs && drugData.FAQs.map((faq,index) =>{
              return(
              <Grid item md={6}  className="mb-2" key={index}>
                <Paper elevation={0} >
                  <Card>
                    <CardActionArea>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div" color="primary" >
                          {faq.Question.Text}
                        </Typography>                        
                        {
                          faq.Question.Answers.map((answer,index)=>{
                            return <Typography>{answer.Text}</Typography>
                          })
                        }
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Paper>
              </Grid>
              )
            })
          }
        </Grid>
      </Grid>
      
      <Grid container direction={"row"} justifyContent={"center"} alignItems={"center"} className="py-5 px-1 section2_4">
        <Grid item container xs={12} sm={9} md={6}  direction={"column"} justifyContent={"center"} alignItems={"flex-start"}>
          <Grid item>
            <h3>{drugData && drugData.Drug && drugData.Drug.Name}</h3>
          </Grid>
          <Grid item>
            <h3><i>{drugData && drugData.Drug && drugData.Drug.FullName}</i></h3>
          </Grid>
          <Grid item container direction={"row"} columnSpacing={4} justifyContent={"flex-start"} alignItems={"flex-start"} className="mt-3">
            <Grid item container direction={"column"} md={4}>
              <Grid item>
                <p>CONSUMER FORMS</p>
              </Grid>
              <Grid item>
                <span>{drugData && drugData.MonoGraphData && drugData.MonoGraphData.ConsumerForms.join(",")}</span>
              </Grid>
            </Grid>
            <Grid item container direction={"column"} md={4}>
              <Grid item>
                <p>CONSUMER ROUTES</p>
              </Grid>
              <Grid item>
                <span>{drugData && drugData.MonoGraphData && drugData.MonoGraphData.ConsumerRoutes}</span>
              </Grid>
            </Grid>
            <Grid item container direction={"column"} md={4}>
              <Grid item>
                <p>THERAPEUTIC CLASSES</p>
              </Grid>
              <Grid item>
                <span>{drugData && drugData.MonoGraphData && drugData.MonoGraphData.TherapeuticClasses}</span>
              </Grid>
            </Grid>
          </Grid>
          <Grid item container direciton={"row"} columnSpacing={4}  justifyContent={"flex-start"} alignItems={"center"} className="mt-3">
            <Grid item md={4}>
              <img src={drugData && drugData.ImageUrl} alt="No Image" />
            </Grid>
            <Grid item md={8}>
              <p>{ drugData.Drug && drugData.Drug.Treatment}</p>
            </Grid>
          </Grid>
          <Grid item container direction={"column"}  justifyContent={"center"} alignItems={"center"}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={tabChange} aria-label="lab API tabs example" textColor="secondary" indicatorColor="secondary">
                  <Tab label="Uses" value="1" />
                  <Tab label="Directions" value="2" />
                  <Tab label="Warnings" value="3" />
                  <Tab label="Side Effects" value="4" />
                  <Tab label="Avoid" value="5" />
                  <Tab label="Storage" value="6" />
                </TabList>
              </Box>
              <TabPanel value="1">{drugData.MonoGraphData && drugData.MonoGraphData.HowToUses}</TabPanel>
              <TabPanel value="2">{drugData.MonoGraphData && drugData.MonoGraphData.Directions}</TabPanel>
              <TabPanel value="3">{drugData.MonoGraphData && drugData.MonoGraphData.WarningCautions.join("\n")}</TabPanel>
              <TabPanel value="4">{drugData.MonoGraphData && drugData.MonoGraphData.LessSeriousSideEffects.join("\n")}</TabPanel>
              <TabPanel value="5">{drugData.MonoGraphData && drugData.MonoGraphData.DrugFoodAvoidings.join("\n")}</TabPanel>
              <TabPanel value="6">{drugData.MonoGraphData && drugData.MonoGraphData.StorageDisposals.join("\n")}</TabPanel>
            </TabContext>
          </Grid>
          <Grid item container direction={"column"} justifyContent={"center"} alignItems={"center"} className="py-5 px-1 section2_4_5" >
            <Grid item>
              <h3 className='mb-3'>Saving on prescriptions has never been easier</h3>
            </Grid>
            <Grid item container direction={"row"} justifyContent={"center"} alignItems={"center"}>
              <Grid item container md={4} direction={"column"} justifyContent={"center"} alignItems={"center"}>
                <Grid item>
                  <div className='step1'></div>
                </Grid>
                <Grid item>
                  <p>STEP ONE</p>
                </Grid>
                <Grid item>
                  <span>Find your prescription</span>
                </Grid>
              </Grid>
              <Grid item container md={4} direction={"column"} justifyContent={"center"} alignItems={"center"}>
                <Grid item>
                  <div className='step2'></div>
                </Grid>
                <Grid item>
                  <p>STEP TWO</p>
                </Grid>
                <Grid item>
                  <span>Compare pricing</span>
                </Grid>
              </Grid>
              <Grid item container md={4} direction={"column"} justifyContent={"center"} alignItems={"center"}>
                <Grid item>
                  <div className='step3'></div>
                </Grid>
                <Grid item>
                  <p>STEP THREE</p>
                </Grid>
                <Grid item>
                  <span>Save at the pharmacy</span>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      
      <Grid container direction={"row"} justifyContent={"center"} alignItems={"center"} className="py-3 px-1 section2_5">
        <Grid item container xs={12} sm={9} md={6}  direction={"column"} justifyContent={"center"} alignItems={"flex-start"}>
          <Grid item>
              <p>© 2023 SingleCare Administrators. All Rights Reserved.</p>
              <p>* Prescription savings vary by prescription and by pharmacy, and may reach up to 80% off cash price.</p>
              <p>Pharmacy names, logos, brands, and other trademarks are the property of their respective owners.</p>
              <p>This is not insurance. This is a discount prescription drug card and it's free to our members. If assistance is needed, please call the help line at 844-234-3057.</p>
          </Grid>
        </Grid>
      </Grid>
      
      <MDBModal show={modalOpen} setShow={setModalOpen} tabIndex='-1' className='section2_modal'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <Grid container direction={"column"}>
                <Grid item>
                  <img src='../logo.png' width='100px'/>
                </Grid>
                <Grid item container direciton={"column"} alignItems={"center"} justifyContent={"center"}>
                  <Grid item>
                    <MDBModalTitle>{modaldata?.name}</MDBModalTitle>
                  </Grid>
                  <Grid item>
                    <span>{modaldata?.description}</span>
                  </Grid>
                </Grid>
              </Grid>
              <Button></Button>
            </MDBModalHeader>
            <MDBModalBody>
              <Grid container direction={"column"} alignItems={"center"}>
                <Grid item>
                  <p>Send this card to yourself or print and bring to the pharmacy</p>
                </Grid>
                <Grid item>
                  <div className='card_image'></div>
                </Grid>
                <Grid item container direction={"row"} columnSpacing={"4"} alignItems={"center"} justifyContent={"center"} className="mt-2 selections">
                  <Grid item>
                    <Button variant='outlined' onClick={()=>setModalSendType('phone')}>Text</Button>
                  </Grid>
                  <Grid item>
                    <Button variant='outlined' onClick={()=>setModalSendType('email')}>Email</Button>
                  </Grid>
                  <Grid item>
                    <Button variant='outlined' onClick={()=>print()}>Print</Button>
                  </Grid>
                </Grid>
                <Grid item container direction={"row"} columnSpacing={2} alignItems={"center"} justifyContent={"center"} className="mt-2">
                  <Grid item>
                    <TextField
                      label={modalsendtype=="email"?"Email address":"Phone number"}
                      size="small"
                      variant="standard"
                      required
                    />
                  </Grid>
                  <Grid item>
                    <Button variant='outlined'>Send</Button>
                  </Grid>
                </Grid>
                <Grid item className='mt-2'>
                  <span>By clicking "Send". I agree to Singlecare's Terms & Conditions.</span>
                </Grid>
              </Grid>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      
      <Backdrop
        sx={{ color: '#fff', zIndex: 2 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}