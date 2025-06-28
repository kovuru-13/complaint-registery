import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const API_BASE = process.env.REACT_APP_API_URL

const ChatWindow = ({ complaintId, name }) => {
  const [messageInput, setMessageInput] = useState('')
  const [messageList, setMessageList] = useState([])
  const messageWindowRef = useRef(null)

  const fetchMessageList = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/messages/${complaintId}`)
      setMessageList(data)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  useEffect(() => {
    fetchMessageList()
  }, [complaintId])

  useEffect(() => {
    if (messageWindowRef.current) {
      messageWindowRef.current.scrollTop = messageWindowRef.current.scrollHeight
    }
  }, [messageList])

  const sendMessage = async () => {
    if (!messageInput.trim()) return

    try {
      const payload = {
        name,
        message: messageInput.trim(),
        complaintId,
      }
      const { data } = await axios.post(`${API_BASE}/messages`, payload)

      setMessageList((prev) => [...prev, data])
      setMessageInput('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <div className="chat-container">
      <h5 style={{ marginBottom: '10px' }}>Message Box</h5>

      <div
        className="message-window"
        ref={messageWindowRef}
        style={{
          height: '200px',
          overflowY: 'auto',
          backgroundColor: '#f8f9fa',
          padding: '10px',
          border: '1px solid #ced4da',
          borderRadius: '5px',
          marginBottom: '10px',
        }}
      >
        {messageList.length > 0 ? (
          [...messageList].reverse().map((msg) => (
            <div key={msg._id} style={{ marginBottom: '10px' }}>
              <p style={{ marginBottom: '2px' }}>
                <strong>{msg.name}</strong>: {msg.message}
              </p>
              <small style={{ color: '#6c757d' }}>
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                , {new Date(msg.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))
        ) : (
          <p style={{ color: '#6c757d' }}>No messages yet.</p>
        )}
      </div>

      <div className="input-container" style={{ display: 'flex', gap: '5px' }}>
        <textarea
          rows={2}
          placeholder="Type your message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          style={{
            width: '100%',
            padding: '6px',
            resize: 'none',
            border: '1px solid #ced4da',
            borderRadius: '4px',
          }}
        />
        <button
          className="btn btn-success"
          onClick={sendMessage}
          style={{ whiteSpace: 'nowrap' }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatWindow
