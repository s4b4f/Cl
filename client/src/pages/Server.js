import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function Server() {
  const { serverId } = useParams();
  const [server, setServer] = useState(null);
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [inviteCode, setInviteCode] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!userId) navigate('/login');
    fetchServer();
    fetchChannels();
  }, [serverId]);

  useEffect(() => {
    if (!currentChannel) return;
    socket.emit('channel:join', currentChannel.id);
    fetch(`http://localhost:3000/api/messages/${currentChannel.id}`)
      .then(res => res.json())
      .then(data => { if (data.success) setMessages(data.data); });
    socket.on('message:new', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    return () => socket.off('message:new');
  }, [currentChannel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchServer = async () => {
    const res = await axios.get(`http://localhost:3000/api/servers/info/${serverId}`);
    setServer(res.data.data);
  };

  const fetchChannels = async () => {
    const res = await axios.get(`http://localhost:3000/api/channels/${serverId}`);
    if (res.data.data.length > 0) setCurrentChannel(res.data.data[0]);
    setChannels(res.data.data);
  };

  const createChannel = async () => {
    if (!channelName.trim()) return;
    await axios.post('http://localhost:3000/api/channels', { name: channelName, serverId });
    setChannelName('');
    setShowCreateChannel(false);
    fetchChannels();
  };

  const createInvite = async () => {
    const res = await axios.post('http://localhost:3000/api/servers/invite', { serverId });
    setInviteCode(res.data.data.code);
    setShowInvite(true);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !currentChannel) return;
    socket.emit('message:send', { content: input, channelId: currentChannel.id, userId });
    setInput('');
  };

  return (
    <div style={{
      display: 'flex', width: '100vw', height: '100vh',
      background: '#111214', color: 'white', fontFamily: 'sans-serif',
      overflow: 'hidden', position: 'fixed', top: 0, left: 0,
    }}>
      {/* 서버 아이콘 사이드바 */}
      <div style={{
        width: '72px', background: '#0e0f11', display: 'flex',
        flexDirection: 'column', alignItems: 'center', padding: '12px 0', gap: '8px',
        borderRight: '1px solid #2e2f35',
      }}>
        <div onClick={() => navigate('/')} style={{
          width: '48px', height: '48px', borderRadius: '50%', background: '#1a1b1e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '20px',
        }}>🏠</div>
      </div>

      {/* 채널 사이드바 */}
      <div style={{
        width: '240px', background: '#1a1b1e', display: 'flex',
        flexDirection: 'column', borderRight: '1px solid #2e2f35',
      }}>
        <div style={{
          padding: '16px', borderBottom: '1px solid #2e2f35',
          fontWeight: '800', fontSize: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>{server?.name || '...'}</span>
          <span onClick={createInvite} style={{ fontSize: '12px', color: '#00b4a6', cursor: 'pointer', fontWeight: '600' }}>초대</span>
        </div>
        <div style={{ flex: 1, padding: '8px', overflowY: 'auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px', color: '#72767d', fontSize: '12px', fontWeight: '700',
          }}>
            <span>채널</span>
            <span onClick={() => setShowCreateChannel(true)} style={{ cursor: 'pointer', fontSize: '18px', color: '#00b4a6' }}>+</span>
          </div>
          {channels.map(ch => (
            <div key={ch.id} onClick={() => setCurrentChannel(ch)} style={{
              padding: '8px 12px', borderRadius: '6px', cursor: 'pointer',
              background: currentChannel?.id === ch.id ? '#00b4a620' : 'none',
              color: currentChannel?.id === ch.id ? '#00b4a6' : '#72767d',
              fontWeight: currentChannel?.id === ch.id ? '700' : '400',
            }}>
              # {ch.name}
            </div>
          ))}
        </div>
        <div style={{
          padding: '12px 16px', borderTop: '1px solid #2e2f35',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '13px', color: '#72767d' }}>@{username}</span>
          <span onClick={() => { localStorage.clear(); navigate('/login'); }}
            style={{ fontSize: '12px', color: '#72767d', cursor: 'pointer' }}>로그아웃</span>
        </div>
      </div>

      {/* 채팅 영역 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentChannel ? (
          <>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #2e2f35', fontWeight: '700' }}>
              # {currentChannel.name}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', background: '#00b4a6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700', fontSize: '14px', flexShrink: 0,
                  }}>
                    {msg.user?.username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <span style={{ fontWeight: '700', fontSize: '14px', marginRight: '8px', color: '#00b4a6' }}>{msg.user?.username}</span>
                    <span style={{ fontSize: '12px', color: '#72767d' }}>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                    <div style={{ fontSize: '14px', marginTop: '4px', color: '#dcddde' }}>{msg.content}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} style={{
              padding: '16px 24px', borderTop: '1px solid #2e2f35', display: 'flex', gap: '12px',
            }}>
              <input value={input} onChange={e => setInput(e.target.value)}
                placeholder={`# ${currentChannel.name} 에 메시지 입력...`}
                style={{
                  flex: 1, padding: '12px 16px', borderRadius: '8px',
                  border: '1px solid #2e2f35', background: '#1a1b1e',
                  color: 'white', fontSize: '14px', outline: 'none',
                }} />
              <button type="submit" style={{
                padding: '12px 20px', background: '#00b4a6', border: 'none',
                borderRadius: '8px', color: 'white', fontWeight: '700', cursor: 'pointer',
              }}>전송</button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#72767d' }}>
            채널을 선택하거나 새로 만들어봐!
          </div>
        )}
      </div>

      {/* 채널 만들기 모달 */}
      {showCreateChannel && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
          <div style={{ background: '#1a1b1e', borderRadius: '16px', padding: '32px', width: '400px' }}>
            <h2 style={{ marginBottom: '20px' }}>채널 만들기</h2>
            <input value={channelName} onChange={e => setChannelName(e.target.value)}
              placeholder="채널 이름..." style={{
                width: '100%', padding: '12px 16px', borderRadius: '8px',
                border: '1px solid #2e2f35', background: '#111214',
                color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
              }} />
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => setShowCreateChannel(false)} style={{
                flex: 1, padding: '12px', background: 'none', border: '1px solid #2e2f35',
                borderRadius: '8px', color: '#72767d', cursor: 'pointer', fontWeight: '700',
              }}>취소</button>
              <button onClick={createChannel} style={{
                flex: 1, padding: '12px', background: '#00b4a6', border: 'none',
                borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: '700',
              }}>만들기</button>
            </div>
          </div>
        </div>
      )}

      {/* 초대 코드 모달 */}
      {showInvite && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
          <div style={{ background: '#1a1b1e', borderRadius: '16px', padding: '32px', width: '400px' }}>
            <h2 style={{ marginBottom: '8px' }}>초대 코드</h2>
            <p style={{ color: '#72767d', fontSize: '13px', marginBottom: '20px' }}>이 코드를 친구한테 공유해봐!</p>
            <div style={{
              background: '#111214', padding: '14px 16px', borderRadius: '8px',
              color: '#00b4a6', fontWeight: '700', fontSize: '18px', letterSpacing: '2px',
              textAlign: 'center', marginBottom: '12px',
            }}>{inviteCode}</div>
            <button onClick={() => navigator.clipboard.writeText(inviteCode)} style={{
              width: '100%', padding: '12px', background: '#00b4a6', border: 'none',
              borderRadius: '8px', color: 'white', fontWeight: '700', cursor: 'pointer', marginBottom: '8px',
            }}>코드 복사</button>
            <button onClick={() => setShowInvite(false)} style={{
              width: '100%', padding: '12px', background: 'none', border: '1px solid #2e2f35',
              borderRadius: '8px', color: '#72767d', fontWeight: '700', cursor: 'pointer',
            }}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Server;