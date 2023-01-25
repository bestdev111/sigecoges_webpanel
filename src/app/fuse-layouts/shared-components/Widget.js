import { useEffect, useState } from 'react';
import { Card, Icon, Tooltip } from '@material-ui/core';
import GoogleMap from 'google-map-react';
import clsx from 'clsx';

function Marker(props) {
  return (
    <>
      {/* <Avatar src={props.avatarUrl} />
      <Typography>{props.userName}</Typography> */}
      <Tooltip title={props.text} placement="top">
        <Icon className="text-red">place</Icon>
      </Tooltip>
    </>
  );
}

function Widget(props) {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (props.data && props.data !== {}) {
      const tempArray = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const key in props.data) {
        if (Object.hasOwnProperty.call(props.data, key)) {
          const element = props.data[key];
          tempArray.push(element);
        }
      }
      setMarkers(tempArray);
    }
  }, [props.data]);
  if (markers.length > 0) {
    console.log('Widget=>', markers[0], props.users, process.env.REACT_APP_MAP_KEY);
  }
  return (
    <>
      {markers.length > 0 && props.users.length > 0 ? (
        <Card className={clsx(props.style, 'rounded-20 shadow')}>
          <GoogleMap
            bootstrapURLKeys={{
              key: process.env.REACT_APP_MAP_KEY,
              // key: 'AIzaSyAXkZSX-YCUwNE_7URaxD5xHWRVnac5nas',
            }}
            defaultZoom={12}
            defaultCenter={[markers[0].lat, markers[0].lng]}
            options={{ styles: props.data.styles }}
            yesIWantToUseGoogleMapApiInternals
          >
            {markers.map((marker) =>
              props.users.map((user) => {
                if (user.id === marker.uid) {
                  return (
                    <Marker
                      key={marker.id}
                      userName={user.name}
                      avatarUrl={user.photo}
                      text={marker.name}
                      lat={marker.lat}
                      lng={marker.lng}
                    />
                  );
                }
              })
            )}
          </GoogleMap>
        </Card>
      ) : null}
    </>
  );
}

export default Widget;
