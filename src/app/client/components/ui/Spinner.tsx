import React from 'react'

export const Spinner = ({ color = '#f86f0fab'}) => {
    return (
        <div className="loader">
          <style jsx>{`
            .loader {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100px;
            }
            .spinner {
              border: 4px solid #f3f3f3;
              border-top: 4px solid ${ color };              
              border-radius: 50%;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <div className="spinner"></div>
        </div>
      );
}
