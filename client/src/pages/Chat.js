import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const channelId = '73b8cabb-a9f4-4507-8edd-ec07a560fc9e';

  useEffect(() => {
  if (!token) navigate('/login');
  
  // 이전 메시지 불러오기
  fetch(`http://localhost:3000/api/messages/${channelId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) setMessages(data.data);
    });

  socket.emit('channel:join', channelId);
  socket.on('message:new', (msg) => {
    setMessages(prev => [...prev, msg]);
  });
  return () => socket.off('message:new');
}, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit('message:send', {
      content: input,
      channelId,
      userId,
    });
    setInput('');
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{
      display: 'flex', width: '100vw', height: '100vh',
      background: '#111214', color: 'white',
      fontFamily: 'sans-serif', overflow: 'hidden',
      position: 'fixed', top: 0, left: 0,
    }}>
      {/* 사이드바 */}
      <div style={{
        width: '240px', minWidth: '240px',
        background: '#1a1b1e', display: 'flex',
        flexDirection: 'column', padding: '16px',
        borderRight: '1px solid #2e2f35',
      }}>
        <div style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>
          NEX<span style={{ color: '#00b4a6' }}>ORA</span>
        </div>
        <div style={{
          background: '#00b4a610', border: '1px solid #00b4a630',
          borderRadius: '8px', padding: '10px 14px',
          cursor: 'pointer', color: '#00b4a6', fontWeight: '600',
        }}>
          # general
        </div>
        <div style={{
          marginTop: 'auto', borderTop: '1px solid #2e2f35',
          paddingTop: '16px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '14px', color: '#72767d' }}>@{username}</span>
          <button onClick={logout} style={{
            background: 'none', border: 'none',
            color: '#72767d', cursor: 'pointer', fontSize: '12px',
          }}>로그아웃</button>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{
          padding: '16px 24px', borderBottom: '1px solid #2e2f35',
          fontWeight: '700', fontSize: '16px', flexShrink: 0,
        }}>
          # general
        </div>
        <div style={{
          flex: 1, overflowY: 'auto', padding: '24px',
          display: 'flex', flexDirection: 'column', gap: '12px',
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: '#00b4a6', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: '700', fontSize: '14px', flexShrink: 0,
              }}>
                {msg.user?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <span style={{ fontWeight: '700', fontSize: '14px', marginRight: '8px', color: '#00b4a6' }}>
                  {msg.user?.username}
                </span>
                <span style={{ fontSize: '12px', color: '#72767d' }}>
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
                <div style={{ fontSize: '14px', marginTop: '4px', color: '#dcddde' }}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} style={{
          padding: '16px 24px', borderTop: '1px solid #2e2f35',
          display: 'flex', gap: '12px', flexShrink: 0,
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="메시지 입력..."
            style={{
              flex: 1, padding: '12px 16px', borderRadius: '8px',
              border: '1px solid #2e2f35', background: '#1a1b1e',
              color: 'white', fontSize: '14px', outline: 'none',
            }}
          />
          <button type="submit" style={{
            padding: '12px 20px', background: '#00b4a6',
            border: 'none', borderRadius: '8px',
            color: 'white', fontWeight: '700', cursor: 'pointer',
          }}>전송</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;