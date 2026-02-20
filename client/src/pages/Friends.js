import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Friends() {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [tab, setTab] = useState('friends');
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (!userId) navigate('/login');
    fetchFriends();
    fetchRequests();
  }, []);

  const fetchFriends = async () => {
    const res = await axios.get(`http://localhost:3000/api/friends/${userId}`);
    setFriends(res.data.data);
  };

  const fetchRequests = async () => {
    const res = await axios.get(`http://localhost:3000/api/friends/requests/${userId}`);
    setRequests(res.data.data);
  };

  const sendRequest = async () => {
    try {
      await axios.post('http://localhost:3000/api/friends/request', {
        senderId: userId, receiverUsername: searchUsername
      });
      alert('친구 요청 보냈어!');
      setSearchUsername('');
    } catch (err) {
      alert('실패! 닉네임 확인해봐');
    }
  };

  const respondRequest = async (requestId, status) => {
    await axios.post('http://localhost:3000/api/friends/respond', { requestId, status });
    fetchFriends();
    fetchRequests();
  };

  return (
    <div style={{
      display: 'flex', width: '100vw', height: '100vh',
      background: '#111214', color: 'white', fontFamily: 'sans-serif',
      overflow: 'hidden', position: 'fixed', top: 0, left: 0,
    }}>
      {/* 사이드바 */}
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
        }}>
          💬 채팅
        </div>
        <div style={{
          padding: '10px 14px', borderRadius: '8px', cursor: 'pointer',
          background: '#00b4a610', border: '1px solid #00b4a630',
          color: '#00b4a6', fontWeight: '600',
        }}>
          👥 친구
        </div>
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

      {/* 메인 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* 탭 */}
        <div style={{
          padding: '16px 24px', borderBottom: '1px solid #2e2f35',
          display: 'flex', gap: '12px', alignItems: 'center',
        }}>
          <span style={{ fontWeight: '700', marginRight: '8px' }}>👥 친구</span>
          {['friends', 'requests', 'add'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '6px 14px', borderRadius: '6px', border: 'none',
              cursor: 'pointer', fontWeight: '600', fontSize: '13px',
              background: tab === t ? '#00b4a6' : '#2e2f35',
              color: tab === t ? 'white' : '#72767d',
            }}>
              {t === 'friends' ? '온라인' : t === 'requests' ? `요청 ${requests.length > 0 ? `(${requests.length})` : ''}` : '친구 추가'}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {/* 친구 목록 */}
          {tab === 'friends' && (
            <div>
              <div style={{ color: '#72767d', fontSize: '12px', fontWeight: '700', marginBottom: '16px' }}>
                친구 — {friends.length}명
              </div>
              {friends.length === 0 && <div style={{ color: '#72767d' }}>아직 친구가 없어 ㅠ</div>}
              {friends.map(f => (
                <div key={f.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px', borderRadius: '8px', marginBottom: '4px',
                  background: '#1a1b1e',
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: '#00b4a6', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: '700',
                  }}>
                    {f.username[0].toUpperCase()}
                  </div>
                  <span style={{ fontWeight: '600' }}>{f.username}</span>
                </div>
              ))}
            </div>
          )}

          {/* 친구 요청 */}
          {tab === 'requests' && (
            <div>
              <div style={{ color: '#72767d', fontSize: '12px', fontWeight: '700', marginBottom: '16px' }}>
                받은 요청 — {requests.length}개
              </div>
              {requests.length === 0 && <div style={{ color: '#72767d' }}>받은 요청이 없어!</div>}
              {requests.map(r => (
                <div key={r.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px', borderRadius: '8px', marginBottom: '4px',
                  background: '#1a1b1e',
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: '#00b4a6', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontWeight: '700',
                  }}>
                    {r.sender.username[0].toUpperCase()}
                  </div>
                  <span style={{ flex: 1, fontWeight: '600' }}>{r.sender.username}</span>
                  <button onClick={() => respondRequest(r.id, 'accepted')} style={{
                    padding: '6px 12px', background: '#00b4a6', border: 'none',
                    borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: '600',
                  }}>수락</button>
                  <button onClick={() => respondRequest(r.id, 'rejected')} style={{
                    padding: '6px 12px', background: '#ed4245', border: 'none',
                    borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: '600',
                  }}>거절</button>
                </div>
              ))}
            </div>
          )}

          {/* 친구 추가 */}
          {tab === 'add' && (
            <div>
              <div style={{ color: '#72767d', fontSize: '12px', fontWeight: '700', marginBottom: '16px' }}>
                친구 추가
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  value={searchUsername}
                  onChange={e => setSearchUsername(e.target.value)}
                  placeholder="닉네임 입력..."
                  style={{
                    flex: 1, padding: '12px 16px', borderRadius: '8px',
                    border: '1px solid #2e2f35', background: '#1a1b1e',
                    color: 'white', fontSize: '14px', outline: 'none',
                  }}
                />
                <button onClick={sendRequest} style={{
                  padding: '12px 20px', background: '#00b4a6', border: 'none',
                  borderRadius: '8px', color: 'white', fontWeight: '700', cursor: 'pointer',
                }}>요청 보내기</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Friends;