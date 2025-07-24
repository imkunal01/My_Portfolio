import React from 'react';

const SocialIcons = () => {
    return (
        <div className="social-icons-container flex gap-4">
            <a
                href="https://instagram.com"
                className="social-icon-link"
                title="Instagram"
                target="_blank"
                rel="noopener noreferrer"
            >
                {/* Instagram */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
            </a>

            <a
                href="https://reddit.com"
                className="social-icon-link"
                title="Reddit"
                target="_blank"
                rel="noopener noreferrer"
            >
                {/* Reddit */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <circle cx="9" cy="13" r="1" />
                    <circle cx="15" cy="13" r="1" />
                    <path d="M12 17c1.66 0 3-1.34 3-3H9c0 1.66 1.34 3 3 3z" />
                    <path d="M20 12.5a8 8 0 01-16 0c0-4.41 3.59-8 8-8s8 3.59 8 8z" />
                </svg>
            </a>

            <a
                href="https://linkedin.com"
                className="social-icon-link"
                title="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
            >
                {/* LinkedIn */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M16 8a6 6 0 016 6v6h-4v-6a2 2 0 00-4 0v6h-4v-6a6 6 0 016-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                </svg>
            </a>

            <a
                href="https://x.com"
                className="social-icon-link"
                title="X (Twitter)"
                target="_blank"
                rel="noopener noreferrer"
            >
                {/* X (formerly Twitter) */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M4 4l16 16M20 4L4 20" />
                </svg>
            </a>

            <a
                href="https://wa.me"
                className="social-icon-link"
                title="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
            >
                {/* WhatsApp */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-16.65 5.64L3 21l3.36-.88A9 9 0 1121 12z" />
                    <path d="M16.5 15a1.7 1.7 0 00-1.2-.51c-.3 0-.59.1-.84.26l-1.26.88a7.25 7.25 0 01-3.19-3.19l.88-1.26a1.5 1.5 0 00-.25-1.77L8 9.5a1.5 1.5 0 00-1.5 0C5.34 10.17 5 12 7 14s3.83 1.66 5.5 0z" />
                </svg>
            </a>
        </div>
    );
};

export default SocialIcons;
