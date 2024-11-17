import React from 'react'

import './myStyles.css'
import { format } from 'date-fns';


const MessageSelf = ({props}) => {
  const formattedTimestamp = props?.timestamp
    ? format(new Date(props.timestamp), 'PPpp')
    : '';

    
  return (
    <div className='self-message-container'>
        <div className='messageBox'>
          <p style={{ color: "black" }}>{props.content}</p>

          <p className='self-timeStamp' style={{ color: "black" }}>{formattedTimestamp}</p>

        </div>
      
    </div>
  )
}

export default MessageSelf
