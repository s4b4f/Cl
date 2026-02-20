import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [servers, setServers] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [serverName, setServerName] = useState('');
  const [serverId, setServerId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!userId) navigate('/login');
    fetchServers();
  }, []);

  const fetchServers = async () => {
    const res = await axios.get(`http://localhost:3000/api/servers/${userId}`);
    setServers(res.data.data);
  };

  const createServer = async () => {
    setError('');
    if (!serverName.trim()) return setError('서버 이름을 입력해줘!');
    try {
      await axios.post('http://localhost:3000/api/servers', { name: serverName, userId });
      setServerName('');
      setShowCreate(false);
      fetchServers();
    } catch (err) {
      setError('서버 만들기 실패!');
    }
  };

  const joinServer = async () => {
    setError('');
    if (!serverId.trim()) return setError('서버 ID를 입력해줘!');
    try {
      await axios.post('http://localhost:3000/api/servers/join', { userId, serverId });
      setServerId('');
      setShowJoin(false);
      fetchServers();
    } catch (err) {
      setError(err.response?.data?.error || '참가 실패!');
    }
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
        <div onClick={() => navigate('/friends')} style={{
          width: '48px', height: '48px', borderRadius: '50%', background: '#1a1b1e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '20px', transition: 'border-radius 0.2s',
        }}>👥</div>
        <div style={{ width: '32px', height: '1px', background: '#2e2f35', margin: '4px 0' }} />
        {servers.map(s => (
          <div key={s.id} onClick={() => navigate(`/server/${s.id}`)} style={{
            width: '48px', height: '48px', borderRadius: '30%', background: '#00b4a6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontWeight: '800', fontSize: '18px',
            transition: 'border-radius 0.2s',
          }}>
            {s.name[0].toUpperCase()}
          </div>
        ))}
        <div onClick={() => { setShowCreate(true); setError(''); }} style={{
          width: '48px', height: '48px', borderRadius: '50%', background: '#1a1b1e',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '24px', color: '#00b4a6',
          transition: 'border-radius 0.2s',
        }}>+</div>
      </div>

      {/* 메인 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>
          NEX<span style={{ color: '#00b4a6' }}>ORA</span>
        </div>
        <p style={{ color: '#72767d', marginBottom: '32px' }}>서버를 선택하거나 새로 만들어봐!</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => { setShowCreate(true); setError(''); }} style={{
            padding: '12px 24px', background: '#00b4a6', border: 'none',
            borderRadius: '8px', color: 'white', fontWeight: '700', cursor: 'pointer',
          }}>+ 서버 만들기</button>
          <button onClick={() => { setShowJoin(true); setError(''); }} style={{
            padding: '12px 24px', background: '#1a1b1e', border: '1px solid #2e2f35',
            borderRadius: '8px', color: 'white', fontWeight: '700', cursor: 'pointer',
          }}>서버 참가하기</button>
        </div>
      </div>

      {/* 하단 유저 정보 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 72, right: 0,
        padding: '12px 24px', borderTop: '1px solid #2e2f35',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#111214',
      }}>
        <span style={{ color: '#72767d', fontSize: '14px' }}>@{username}</span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span onClick={() => navigate('/settings')} style={{ color: '#72767d', cursor: 'pointer', fontSize: '13px' }}>⚙️ 설정</span>
          <span onClick={() => { localStorage.clear(); navigate('/login'); }} style={{ color: '#72767d', cursor: 'pointer', fontSize: '13px' }}>로그아웃</span>
        </div>
      </div>

      {/* 서버 만들기 모달 */}
      {showCreate && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
          <div style={{
            background: '#1a1b1e', borderRadius: '16px', padding: '32px',
            width: '400px', boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          }}>
            <h2 style={{ marginBottom: '8px', fontSize: '20px' }}>서버 만들기</h2>
            <p style={{ color: '#72767d', fontSize: '13px', marginBottom: '24px' }}>서버 이름을 정해봐!</p>
            <input value={serverName} onChange={e => { setServerName(e.target.value); setError(''); }}
              placeholder="서버 이름..." style={{
                width: '100%', padding: '12px 16px', borderRadius: '8px',
                border: `1px solid ${error ? '#ed4245' : '#2e2f35'}`, background: '#111214',
                color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
              }} />
            {error && <div style={{ color: '#ed4245', fontSize: '13px', marginTop: '6px' }}>{error}</div>}
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => setShowCreate(false)} style={{
                flex: 1, padding: '12px', background: 'none', border: '1px solid #2e2f35',
                borderRadius: '8px', color: '#72767d', cursor: 'pointer', fontWeight: '700',
              }}>취소</button>
              <button onClick={createServer} style={{
                flex: 1, padding: '12px', background: '#00b4a6', border: 'none',
                borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: '700',
              }}>만들기</button>
            </div>
          </div>
        </div>
      )}

      {/* 서버 참가 모달 */}
      {showJoin && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
          <div style={{
            background: '#1a1b1e', borderRadius: '16px', padding: '32px',
            width: '400px', boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          }}>
            <h2 style={{ marginBottom: '8px', fontSize: '20px' }}>서버 참가하기</h2>
            <p style={{ color: '#72767d', fontSize: '13px', marginBottom: '24px' }}>서버 ID를 입력해봐!</p>
            <input value={serverId} onChange={e => { setServerId(e.target.value); setError(''); }}
              placeholder="서버 ID..." style={{
                width: '100%', padding: '12px 16px', borderRadius: '8px',
                border: `1px solid ${error ? '#ed4245' : '#2e2f35'}`, background: '#111214',
                color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
              }} />
            {error && <div style={{ color: '#ed4245', fontSize: '13px', marginTop: '6px' }}>{error}</div>}
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => setShowJoin(false)} style={{
                flex: 1, padding: '12px', background: 'none', border: '1px solid #2e2f35',
                borderRadius: '8px', color: '#72767d', cursor: 'pointer', fontWeight: '700',
              }}>취소</button>
              <button onClick={joinServer} style={{
                flex: 1, padding: '12px', background: '#00b4a6', border: 'none',
                borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: '700',
              }}>참가</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;