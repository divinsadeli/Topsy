function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#faf7f4'
    }}>
      <h1 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: '2.5rem',
        color: '#1a1a1a',
        marginBottom: '1rem',
        letterSpacing: '0.1em'
      }}>
        TOPSY
      </h1>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #e8d5c4',
        borderTop: '3px solid #c9647a',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default LoadingScreen
