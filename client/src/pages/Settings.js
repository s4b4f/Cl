import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Settings() {
  const [newUsername, setNewUsername] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const currentTag = localStorage.getItem('tag');
  const username = localStorage.getItem('username');

  const changeUsername = async () => {
    setError('');
    setSuccess('');
    if (!newUsername.trim()) return setError('닉네임을 입력해줘!');
    if (newUsername.trim().length < 2) return setError('닉네임은 2글자 이상이어야 해!');
    if (newUsername.trim().length > 20) return setError('닉네임은 20글자 이하여야 해!');
    try {
      const res = await axios.put('http://localhost:3000/api/users/username', {
        userId, newUsername
      });
      localStorage.setItem('username', res.data.data.username);
      localStorage.setItem('tag', res.data.data.tag);
      setResult(res.data.data.tag);
      setSuccess('닉네임이 변경됐어!');
      setNewUsername('');
    } catch (err) {
      setError('실패! 다시 해봐');
    }
  };

  return (
    <div style={{
      display: 'flex', width: '100vw', height: '100vh',
      background: '#111214', color: 'white', fontFamily: 'sans-serif',
      overflow: 'hidden', position: 'fixed', top: 0, left: 0,
    }}>
      <div style={{
        width: '240px', minWidth: '240px', background: '#1a1b1e',
        display: 'flex', flexDirection: 'column', padding: '16px',
        borderRight: '1px solid #2e2f35',
      }}>
        <div style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>
          NEX<span style={{ color: '#00b4a6' }}>ORA</span>
        </div>
        <div onClick={() => navigate('/chat')} style={{
          padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
          color: '#72767d', fontWeight: '600', marginBottom: '8px',
        }}>💬 채팅</div>
        <div onClick={() => navigate('/friends')} style={{
          padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
          color: '#72767d', fontWeight: '600', marginBottom: '8px',
        }}>👥 친구</div>
        <div style={{
          padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
          background: '#00b4a610', border: '1px solid #00b4a630',
          color: '#00b4a6', fontWeight: '600',
        }}>⚙️ 설정</div>
        <div style={{
          marginTop: 'auto', borderTop: '1px solid #2e2f35',
          paddingTop: '16px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '14px', color: '#72767d' }}>@{username}</span>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{
            background: 'none', border: 'none', color: '#72767d',
            cursor: 'pointer', fontSize: '12px',
          }}>로그아웃</button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <h2 style={{ marginBottom: '32px', fontSize: '20px', fontWeight: '800' }}>⚙️ 설정</h2>
        <div style={{
          background: '#1a1b1e', borderRadius: '12px',
          padding: '24px', maxWidth: '500px', boxSizing: 'border-box',
        }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: '#72767d', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>현재 태그</div>
            <div style={{
              background: '#111214', padding: '12px 16px', borderRadius: '8px',
              color: '#00b4a6', fontWeight: '700', fontSize: '16px',
            }}>
              {result || currentTag || '로그인 후 확인 가능'}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ color: '#72767d', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>새 닉네임</div>
            <input
              value={newUsername}
              onChange={e => { setNewUsername(e.target.value); setError(''); setSuccess(''); }}
              placeholder="새 닉네임 입력..."
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '8px',
                border: `1px solid ${error ? '#ed4245' : '#2e2f35'}`, background: '#111214',
                color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
              }}
            />
            <div style={{ fontSize: '12px', marginTop: '6px', color: '#72767d' }}>
              태그는 자동으로 생성돼 ex) {newUsername || '닉네임'}#Ab3K
            </div>
            {error && <div style={{ color: '#ed4245', fontSize: '13px', marginTop: '6px' }}>{error}</div>}
            {success && <div style={{ color: '#00b4a6', fontSize: '13px', marginTop: '6px' }}>{success}</div>}
          </div>

          <button onClick={changeUsername} style={{
            width: '100%', padding: '12px', background: '#00b4a6',
            border: 'none', borderRadius: '8px', color: 'white',
            fontWeight: '700', cursor: 'pointer', fontSize: '15px',
            boxSizing: 'border-box',
          }}>변경하기</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;