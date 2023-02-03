/* eslint-disable no-else-return */
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { memo } from 'react';
import _ from '@lodash';
import { useSelector } from 'react-redux';
import FuseNavVerticalLayout1 from './vertical/FuseNavVerticalLayout1';
import FuseNavHorizontalCollapse from './horizontal/types/FuseNavHorizontalCollapse';
import FuseNavHorizontalGroup from './horizontal/types/FuseNavHorizontalGroup';
import FuseNavHorizontalItem from './horizontal/types/FuseNavHorizontalItem';
import FuseNavHorizontalLink from './horizontal/types/FuseNavHorizontalLink';
import FuseNavVerticalCollapse from './vertical/types/FuseNavVerticalCollapse';
import FuseNavVerticalGroup from './vertical/types/FuseNavVerticalGroup';
import FuseNavVerticalItem from './vertical/types/FuseNavVerticalItem';
import FuseNavVerticalLink from './vertical/types/FuseNavVerticalLink';
import { registerComponent } from './FuseNavItem';
/*
Register Fuse Navigation Components
 */
registerComponent('vertical-group', FuseNavVerticalGroup);
registerComponent('vertical-collapse', FuseNavVerticalCollapse);
registerComponent('vertical-item', FuseNavVerticalItem);
registerComponent('vertical-link', FuseNavVerticalLink);
registerComponent('horizontal-group', FuseNavHorizontalGroup);
registerComponent('horizontal-collapse', FuseNavHorizontalCollapse);
registerComponent('horizontal-item', FuseNavHorizontalItem);
registerComponent('horizontal-link', FuseNavHorizontalLink);
registerComponent('vertical-divider', () => <Divider className="my-16" />);
registerComponent('horizontal-divider', () => <Divider className="my-16" />);

const useStyles = makeStyles((theme) => ({
  '@global': {
    '.popper-navigation-list': {
      '& .fuse-list-item': {
        padding: '8px 12px 8px 12px',
        height: 40,
        minHeight: 40,
        '& .fuse-list-item-text': {
          padding: '0 0 0 8px',
        },
      },
      '&.dense': {
        '& .fuse-list-item': {
          minHeight: 32,
          height: 32,
          '& .fuse-list-item-text': {
            padding: '0 0 0 8px',
          },
        },
      },
    },
  },
}));

function FuseNavigation(props) {
  const classes = useStyles(props);
  const options = _.pick(props, [
    'navigation',
    'layout',
    'active',
    'dense',
    'className',
    'onItemClick',
    'firstLevel',
    'selectedId',
  ]);
  const user = useSelector(({ auth }) => auth.user);

  function removeObjects1(content) {
    return content.reduce((arr, obj) => {
      if (obj.id && obj.id === 'mygroup') {
        return arr;
      } else if (obj.children && obj.children.length) {
        arr.push({ ...obj, children: removeObjects1(obj.children) });
        return arr;
      } else {
        arr.push(obj);
        return arr;
      }
    }, []);
  }
  function removeObjects2(content) {
    return content.reduce((arr, obj) => {
      if (obj.id && obj.id === 'groups') {
        return arr;
      } else if (obj.children && obj.children.length) {
        arr.push({ ...obj, children: removeObjects2(obj.children) });
        return arr;
      } else {
        arr.push(obj);
        return arr;
      }
    }, []);
  }
  if (user.role && props.navigation.length > 0) {
    if (user.role === 'SUPER_ADMIN') {
      const result = removeObjects1(options.navigation);
      options.navigation = result;
      return <FuseNavVerticalLayout1 {...options} />;
    }
    if (user.role === 'ADMIN') {
      const result = removeObjects2(options.navigation);
      options.navigation = result;
      return <FuseNavVerticalLayout1 {...options} />;
    }
  }
  return null;
}

FuseNavigation.propTypes = {
  navigation: PropTypes.array.isRequired,
};

FuseNavigation.defaultProps = {
  layout: 'vertical',
};

export default memo(FuseNavigation);
