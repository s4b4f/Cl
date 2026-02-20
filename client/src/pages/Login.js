import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('username', res.data.data.username);
      localStorage.setItem('userId', res.data.data.userId);
      localStorage.setItem('tag', res.data.data.tag);
      navigate('/chat');
    } catch (err) {
      setError('이메일이나 비밀번호가 틀렸어!');
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100vw', height: '100vh',
      background: 'linear-gradient(135deg, #0f1923 0%, #111214 40%, #0a1a1f 100%)',
      margin: 0, padding: 0,
    }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { margin: 0; padding: 0; overflow: hidden; }
        .login-btn {
          width: 100%; padding: 14px; margin-top: 8px;
          background: #00b4a6; color: white; border: none;
          border-radius: 8px; cursor: pointer; font-weight: 700;
          font-size: 15px; letter-spacing: 0.3px;
          transition: box-shadow 0.3s ease, background 0.3s ease;
        }
        .login-btn:hover { background: #00c4b4; box-shadow: 0 0 18px rgba(0, 180, 166, 0.45); }
      `}</style>

      <div style={{
        background: '#1a1b1e', borderRadius: '16px', padding: '48px 40px',
        width: '420px', boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        <div style={{ fontSize: '28px', fontWeight: '800', color: 'white', marginBottom: '8px', letterSpacing: '-0.5px' }}>
          NEX<span style={{ color: '#00b4a6' }}>ORA</span>
        </div>
        <p style={{ color: '#72767d', fontSize: '14px', marginBottom: '36px' }}>다시 만나서 반가워요!</p>

        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <input type="email" placeholder="이메일" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
            style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: `1px solid ${error ? '#ed4245' : '#2e2f35'}`, background: '#111214', color: 'white', fontSize: '14px', outline: 'none' }} />
          <input type="password" placeholder="비밀번호" value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
            style={{ width: '100%', padding: '14px 16px', borderRadius: '8px', border: `1px solid ${error ? '#ed4245' : '#2e2f35'}`, background: '#111214', color: 'white', fontSize: '14px', outline: 'none' }} />
          {error && <div style={{ color: '#ed4245', fontSize: '13px', alignSelf: 'flex-start' }}>{error}</div>}
          <button type="submit" className="login-btn">로그인</button>
        </form>

        <p style={{ color: '#72767d', fontSize: '13px', marginTop: '20px' }}>
          계정이 없어?{' '}
          <span onClick={() => navigate('/register')} style={{ color: '#00b4a6', cursor: 'pointer', fontWeight: '600' }}>회원가입</span>
        </p>
      </div>
    </div>
  );
}

export default Login;