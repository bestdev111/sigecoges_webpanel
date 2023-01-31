import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Table, TableHead, TableCell, TableBody, TableRow, Icon, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import firebaseService from 'app/services/firebaseService';

const useStyles = makeStyles({
  typeIcon: {
    '&.folder:before': {
      content: "'folder'",
      color: '#FFB300',
    },
    '&.docx:before': {
      content: "'insert_drive_file'",
      color: '#1565C0',
    },
    '&.doc:before': {
      content: "'insert_drive_file'",
      color: '#1565C0',
    },
    '&.txt:before': {
      content: "'title'",
      color: '#1565C0',
    },
    '&.xlx:before': {
      content: "'insert_chart'",
      color: '#4CAF50',
    },
    '&.xlsx:before': {
      content: "'insert_chart'",
      color: '#4CAF50',
    },
    '&.pdf:before': {
      content: "'picture_as_pdf'",
      color: '#4CAF50',
    },
    '&.jpg:before': {
      content: "'perm_media'",
      color: '#FFB300',
    },
    '&.jpeg:before': {
      content: "'perm_media'",
      color: '#FFB300',
    },
    '&.png:before': {
      content: "'perm_media'",
      color: '#FFB300',
    },
    '&.gif:before': {
      content: "'perm_media'",
      color: '#FFB300',
    },
    '&.ppt:before': {
      content: "'filter_hdr'",
      color: '#f44336',
    },
    '&.pptx:before': {
      content: "'filter_hdr'",
      color: '#f44336',
    },
  },
});

const list = [
  'txt',
  'pdf',
  'doc',
  'docx',
  'jpg',
  'jpeg',
  'png',
  'gif',
  'zip',
  'ppt',
  'pptx',
  'xlx',
  'xlsx',
];

const DocumentTab = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [documents, setDocuments] = useState();
  useEffect(() => {
    fetchGetDocs();
  }, []);

  const fetchGetDocs = async () => {
    await firebaseService.getDocs().then(
      (docs) => {
        setDocuments(docs);
        return docs;
      },
      (error) => {
        return error;
      }
    );
  };
  return (
    <motion.div
      initial={{ y: 50, opacity: 0.8 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
    >
      <Table className="simple borderless">
        <TableHead>
          <TableRow>
            <TableCell className="max-w-64 w-64 p-0 text-center"> </TableCell>
            <TableCell>Name</TableCell>
            <TableCell className="hidden sm:table-cell">Type</TableCell>
            <TableCell className="hidden sm:table-cell">For user</TableCell>
            <TableCell className="hidden sm:table-cell">Uploaded</TableCell>
            <TableCell className="hidden sm:table-cell" />
          </TableRow>
        </TableHead>

        <TableBody>
          {documents
            ? documents.map((docs, index) => {
                if (list.includes(docs.type)) {
                  return (
                    <TableRow
                      key={index}
                      hover
                      // onClick={docs.url}
                      // selected={docs.id === selectedItemId}
                      className="cursor-pointer h-64"
                    >
                      <TableCell className="max-w-64 w-64 p-0 text-center">
                        <Icon className={clsx(classes.typeIcon, docs.type)} />
                      </TableCell>
                      <TableCell className="font-medium">{docs.description}</TableCell>
                      <TableCell className="hidden sm:table-cell">{docs.type}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {props && props.userData
                          ? props.userData.map((item, key) => {
                              if (item.id === docs.uid) {
                                return (
                                  <div key={key} className="flex">
                                    <Avatar src={item.photo} />
                                    <div className="flex items-center ml-5">{item.name}</div>
                                  </div>
                                );
                              }
                            })
                          : null}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{docs.date}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Icon
                          component={motion.span}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, transition: { delay: 0.2 } }}
                          className="text-24 md:text-32"
                        >
                          <a href={docs.url}>save_alt</a>
                        </Icon>
                      </TableCell>
                    </TableRow>
                  );
                }
              })
            : null}
        </TableBody>
      </Table>
    </motion.div>
  );
};
export default DocumentTab;
