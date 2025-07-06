import { useState } from "react"
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';

type AcceptCancelProps = {
  onAccept?: () => void;
  onCancel?: () => void;
  noCancel?: boolean;
  noAccept?: boolean;
}
export default function AcceptCancel ( { onAccept, onCancel, noCancel, noAccept }: AcceptCancelProps ) {
    const [ submitChangesHovered, setSubmitChangesHovered ] = useState(false);
    const [ cancelChangesHovered, setCancelChangesHovered ] = useState(false);

    return (
        <div
            style={{
              display: 'flex',
              gap: '5px'
            }}
          >
            {noAccept ? <></> : <button 
              style={{ 
                backgroundColor:  submitChangesHovered ? 'green' : 'white',
                color: submitChangesHovered ? 'white' : 'green',
                transition: '0.3s',
                borderRadius: '5px', 
                border: 'none',
                height: '35px',
                cursor: 'pointer',
                zIndex: '1'
              }}
              type='submit'
              onMouseEnter={() => setSubmitChangesHovered(true)}
              onMouseLeave={() => setSubmitChangesHovered(false)}
            >
              <DoneIcon fontSize='large'/>
            </button>}
            {noCancel ? <></> : <button 
              style={{ 
                backgroundColor:  cancelChangesHovered ? 'black' : 'red',
                color: cancelChangesHovered ? 'red' : 'black',
                transition: '0.3s',
                borderRadius: '5px', 
                border: 'none',
                height: '35px',
                cursor: 'pointer',
                zIndex: '1'
              }}
              
              type='button'
              onMouseEnter={() => setCancelChangesHovered(true)}
              onMouseLeave={() => setCancelChangesHovered(false)}
              onClick={onCancel}
            >
              <ClearIcon fontSize='large'/>
            </button>}
          </div>
    )
}