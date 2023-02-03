/* eslint-disable import/no-extraneous-dependencies */
/* global google */
import { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  Marker,
  Circle,
  InfoWindow,
} from 'react-google-maps';
// import { Icon } from '@material-ui/core';
// import { InfoBox } from 'react-google-maps/lib/components/addons/InfoBox';
import clsx from 'clsx';

const useStyles = makeStyles({
  ellipsis: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'normal',
    display: 'block',
    width: '200px',
  },
  parent: {
    position: 'relative',
    boxSizing: 'border-box',
    overflow: 'hidden',
    top: 0,
    left: 0,
    transform: 'translate3d(-50%,-100%,0)',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '0 2px 7px 1px rgb(0 0 0 / 30%)',
  },
  tooltip: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: 14,
    // boxShadow: theme.shadows[1],
  },
});

const Map = (props) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [toolTip, setToolTip] = useState(null);
  const toolTipFunc = (index) => {
    if (toolTip === null) {
      setIsOpen(true);
    }
    if (toolTip === index) {
      setIsOpen(!isOpen);
    }
    setToolTip(index);
  };
  console.log('MARKERS=> ', props.markers);
  if (props.markers && props.markers.length > 0) {
    return (
      <GoogleMap
        defaultZoom={props.zoom}
        defaultCenter={{ lat: props.markers[0].lat, lng: props.markers[0].lng }}
      >
        {props.markers.map((place, index) => {
          return (
            <Fragment key={index}>
              <Marker
                position={{
                  lat: parseFloat(place.lat),
                  lng: parseFloat(place.lng),
                }}
                onClick={() => toolTipFunc(index)}
              >
                {isOpen && toolTip === index ? (
                  <InfoWindow
                    className="p-4"
                    defaultPosition={new google.maps.LatLng(place.lat, place.lng)}
                    options={{ closeBoxURL: ``, enableEventPropagation: true }}
                    onClick={() => toolTipFunc(index)}
                  >
                    {/* <Icon>person</Icon> */}
                    <div>
                      <p className={clsx(classes.tooltip, 'text-16 font-bold')}>
                        {'Name : '}
                        {place.name}
                      </p>
                      <p className={classes.tooltip}>
                        {'Group : '}
                        {place.group_name}
                      </p>
                      <p className={clsx(classes.ellipsis, classes.tooltip)}>
                        {'Address : '}
                        {place.address}
                      </p>
                    </div>
                  </InfoWindow>
                ) : null}
              </Marker>
              <Circle
                defaultCenter={{
                  lat: parseFloat(place.lat),
                  lng: parseFloat(place.lng),
                }}
                radius={200}
                options={{
                  fillColor: '#ff0000',
                  strokeColor: '#ff0000',
                  fillOpacity: 0.3,
                  strokeOpacity: 0.2,
                }}
              />
            </Fragment>
          );
        })}
      </GoogleMap>
    );
  }
  return <GoogleMap defaultZoom={props.zoom} defaultCenter={{ lat: 5.338537, lng: -3.947649 }} />;
};

export default withScriptjs(withGoogleMap(Map));
