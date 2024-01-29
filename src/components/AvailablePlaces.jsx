import { useState,useEffect } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx';
import {sortPlacesByDistance} from  '../loc.js'
export default function AvailablePlaces({ onSelectPlace }) {
  const [AvailablePlaces,setAvailablePlaces] = useState([]);
  const[isFetching,setisFetching] = useState(false);
  const[error,seterror]= useState();

  useEffect(()=> {
    async function fetchPlaces(){
      setisFetching(true);
      try{
        const response = await fetch('http://localhost:3000/places');
      const resData = await response.json();
        if(!response.ok){
          throw new Error('Failed to fetch places');
        }
        navigator.geolocation.getCurrentPosition((position  )=>{

          const sortedPlaces = sortPlacesByDistance(
            resData.places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setisFetching(false);
        });
       

    }
    catch(error){
      seterror(error)
      setisFetching(false);
    }
      
     
     
    }
    // fetch('http://localhost:3000/places')
    // .then((response) => {
    //   return response.json();
    // })
    // .then((res)=> {
    //   setAvailablePlaces(res);
    // })
    fetchPlaces()
  },[])
  
  if(error){
    return <Error title="An error occurred!" message={error.message}/>;
  }


    return (
    <Places
      title="Available Places"
      places={AvailablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
