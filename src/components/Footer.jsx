import React, { forwardRef } from 'react';

const Footer = forwardRef((props, ref) => {
    const Year = new Date().getFullYear();

    return (
        <div className="flex justify-center bottom-[100%] text-white">
            <div>
                <footer ref={ref} className='footer'>
                    <p>&copy; {Year} Kokomi. All rights reserved.</p>
                </footer>
            </div>
        </div>
    )
});

export default Footer;