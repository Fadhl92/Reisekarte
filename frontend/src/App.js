 import './App.css';
import { useEffect, useState } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import { Room, Star, Sync } from "@material-ui/icons";
import axios from 'axios';
import {format} from "timeago.js"
import { Input, StepLabel } from '@material-ui/core';
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const myStorage = window.localStorage;
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user"));
  const[pins, setPins]=useState([])
  const[CurrentPlaceId, setCurrentPlaceId]= useState(null);
  const[title, setTitle]=useState(null)
  const[desc, setDesc]=useState(null)
  const[rating, setRating]=useState(0)
  const[newPlace, setNewPlace]=useState(null)
  const[showRegister, setShowRegister]=useState(false)
  const[showLogin,setShowLogin]=useState(false)
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 52.520008,
    longitude: 13.404954,
    zoom: 4
  });



  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleLogout = () => {
    setCurrentUsername(null);
    myStorage.removeItem("user");
  };

  const handleMarkerClick=(id,lat,long)=>{
    setCurrentPlaceId(id)
    setViewport({...viewport, latitude:lat, longitude:long});

  };

  const handleAddClick=(e) =>{
    const[longitude, latitude]=e.lngLat;
    setNewPlace({

      lat: latitude,
      long: longitude,
    });

  };

  const handleSubmit= async(e)=>{
    e.preventDefault();
    const newPin={
      username:currentUsername,
      title,
      desc,
      rating,
      lat:newPlace.lat,
      long:newPlace.long
    }

    try{

      const res=await axios.post("/pins",newPin)
      setPins([...pins, res.data]);
      setNewPlace(null)
    }catch(err){
      console.log(err)
    }
  };
    
  return (
    <div className="App">
     <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
      onViewportChange={nextViewport => setViewport(nextViewport)}
      mapStyle="mapbox://styles/googfy/ckxf2dzg20huz14npc6zw4k29"
      onDblClick={currentUsername && handleAddClick}
      
     >
 
       {pins.map(p=>(

<>   
    <Marker 
    latitude={p.lat} 
     longitude={p.long} 
     offsetLeft={-3.5 * viewport.zoom}
     offsetTop={-7 * viewport.zoom}

      
   >
     <Room style={{fontSize:viewport.zoom *7, color: p.username === currentUsername? "tomato" : "slateblue", cursor:"pointer"}} 
      onClick={()=>handleMarkerClick(p._id,p.lat,p.long)}
/>
  
      </Marker>

      {p._id === CurrentPlaceId &&(
      <Popup
          latitude={p.lat}
          longitude={p.long}
          closeButton={true}
          closeOnClick={false}
          anchor="left"  
          onClose={()=>setCurrentPlaceId(null)}
          >

          <div className="card">
            <label>Place</label>
            <h4 className="place"> {p.title}</h4>
            <label>Review</label>
            <p className="desc"> {p.desc}</p>
            <label>Rating</label>
            <div className="stars">
             {Array(p.rating).fill( <Star className="star"/>)}
              
              </div>
            <label>Information</label>
            <span className="username"> Created by<b> {p.username}</b>
            </span>
            <span className="date"> {format(p.createdAt)}</span>
            </div>
        </Popup> 
      )}
        </>
              ))}

    {newPlace && (
     <>
     <Marker
       latitude={newPlace.lat}
       longitude={newPlace.long}
       offsetLeft={-3.5 * viewport.zoom}
       offsetTop={-7 * viewport.zoom}
     >
       <Room
         style={{
           fontSize: 7 * viewport.zoom,
           color: "tomato",
           cursor: "pointer",
         }}
       />
     </Marker>
             <Popup
          latitude={newPlace.lat}
          longitude={newPlace.long}
          closeButton={true}
          closeOnClick={false}
          anchor="left"  
          onClose={()=>setNewPlace(null)}
              
             >
               <dev>
                 <form onSubmit={handleSubmit}>

                   <label>Title</label>
                   <input placeholder="Enter a title" onChange={(e)=>setTitle(e.target.value)}/>
                   <label>Description</label>
                   <textarea placeholdeer="Say us something about this place." onChange={(e)=>setDesc(e.target.value)}/>
                   
                   <label>Rating</label>
                   <select onChange={(e)=>setRating(e.target.value)}>


                     <option value="1">1</option>
                     <option value="2">2</option>
                     <option value="3">3</option>
                     <option value="4">4</option>
                     <option value="5">5</option>
                   </select>
                   <button className="submitButton" type="submit">Add Pin</button>
                 </form>
               </dev>
             </Popup>   
             </>
              )}  
              {currentUsername ? (<button className="button logout" onClick={handleLogout}>Logout</button>
              ): ( 
            
              <div className="buttons"> 
              <button className="button login" onClick={()=> setShowLogin(true)}>Login</button>
              <button className="button register" onClick={()=> setShowRegister(true)}>Register</button>
              </div>
)}    
{showRegister &&   <Register setShowRegister={setShowRegister}/>  }
{showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUsername={setCurrentUsername}/>}
     </ReactMapGL>
    
</div>
); 
}



export default App;
