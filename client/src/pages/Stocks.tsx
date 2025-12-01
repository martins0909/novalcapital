const boxStyle = "bg-white rounded-lg shadow flex flex-col items-center justify-between aspect-square w-full h-full p-0 overflow-hidden";
const imgStyle = "object-cover w-full h-full rounded-lg";

const Stocks = () => {
  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <h1 className="text-4xl font-bold mb-2 text-white text-center">Stocks</h1>
      <h2 className="text-lg text-gray-100 mb-8 text-center">Explore market opportunities</h2>

      {/* Commodities Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4 text-white text-center">Commodities</h3>
        <div className="w-full flex justify-center mb-10">
          <hr className="w-1/2 border-t-2 border-gray-400" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className={boxStyle}>
            <img src="/other-img/gold.jpg" alt="Gold" className={imgStyle} />
            <span className="font-medium text-black text-center block w-full py-2 bg-white bg-opacity-90">Gold</span>
          </div>
          <div className={boxStyle}>
            <img src="/other-img/silver.jpg" alt="Silver" className={imgStyle} />
            <span className="font-medium text-black text-center block w-full py-2 bg-white bg-opacity-90">Silver</span>
          </div>
          <div className={boxStyle}>
            <img src="/other-img/crude,jpg.jpg" alt="Crude Oil" className={imgStyle} />
            <span className="font-medium text-black text-center block w-full py-2 bg-white bg-opacity-90">Crude Oil</span>
          </div>
          <div className={boxStyle}>
            <img src="/other-img/brent.jpg" alt="Brent Oil" className={imgStyle} />
            <span className="font-medium text-black text-center block w-full py-2 bg-white bg-opacity-90">Brent Oil</span>
          </div>
        </div>
      </div>
      {/* Stocks Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4 text-white text-center">Stocks</h3>
        <div className="w-full flex justify-center mb-10">
          <hr className="w-1/2 border-t-2 border-gray-400" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className={boxStyle}>
            <img src="/other-img/applet.jpg" alt="Apple" className={imgStyle} />
            <span className="font-medium text-black text-center block w-full py-2 bg-white bg-opacity-90">Apple</span>
          </div>
          <div className={boxStyle}>
            <img src="/other-img/microsoft.jpg" alt="Microsoft" className={imgStyle} />
            <span className="font-medium text-black text-center block w-full py-2 bg-white bg-opacity-90">Microsoft</span>
          </div>
          <div className={boxStyle}>
            <img src="/other-img/netflix.png" alt="Netflix" className={imgStyle} />
            <span className="font-medium text-black text-center block w-full py-2 bg-white bg-opacity-90">Netflix</span>
          </div>
          <div className={boxStyle}>
            <img src="/other-img/ALPHABET.jpg" alt="Alphabet" className={imgStyle} />
            <span className="font-medium text-black text-center block w-full py-2 bg-white bg-opacity-90">Alphabet</span>
          </div>
          {/* Only the provided crypto currency boxes */}
          {[ 
            { src: '/other-img/visa.png', name: 'Visa' },
            { src: '/other-img/tesla.jpg', name: 'Tesla' },
            { src: '/other-img/general motors.jpg', name: 'General Motors' },
            { src: '/other-img/berkshire.png', name: 'Berkshire Hathaway' },
            { src: '/other-img/jpmorgan.png', name: 'JPMorgan Chase' },
            { src: '/other-img/mastercard-inc.jpg', name: 'Mastercard Inc.' },
            { src: '/other-img/cocacola.png', name: 'Coca-Cola' },
            { src: '/other-img/facebook.jpg', name: 'Facebook' },
            { src: '/other-img/amazon.jpg', name: 'Amazon' }
          ].map((item, i) => (
            <div className={boxStyle} key={i}>
              <img src={item.src} alt={item.name} className={imgStyle} />
              <span className="font-medium text-black text-center block w-full py-2 bg-white bg-opacity-90">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Crypto Currencies Section - only provided images */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4 text-white text-center">Crypto Currencies</h3>
        <div className="w-full flex justify-center mb-10">
          <hr className="w-1/2 border-t-2 border-gray-400" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { src: '/other-img/btc.jpg', name: 'Bitcoin' },
            { src: '/other-img/entheruem.jpg', name: 'Ethereum' },
            { src: '/other-img/tron.jpg', name: 'Tron' },
            { src: '/other-img/dodge coin.jpg', name: 'Doge Coin' },
            { src: '/other-img/litecoin.jpg', name: 'Litecoin' },
            { src: '/other-img/cardano.jpg', name: 'Cardano' },
            { src: '/other-img/Binance.jpg', name: 'Binance' }
          ].map((item, i) => (
            <div className={boxStyle} key={i}>
              <img src={item.src} alt={item.name} className={imgStyle} />
              <span className="font-medium text-black text-center block w-full py-2 bg-white bg-opacity-90">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* ETFS Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-4 text-white text-center">ETFS</h3>
        <div className="w-full flex justify-center mb-10">
          <hr className="w-1/2 border-t-2 border-gray-400" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className={boxStyle}>
            <img src="/other-img/SSPY-S&P.jpg" alt="S&P 500" className={imgStyle} />
            <span className="font-medium text-black text-center block w-full py-2 bg-white bg-opacity-90">S&P 500</span>
          </div>
          <div className={boxStyle}>
            <img src="/other-img/VANGUARDTOTALSTOCKMARKET.png" alt="Vanguard Total Stock Market" className={imgStyle} />
            <span className="font-medium text-black text-center block w-full py-2 bg-white bg-opacity-90">Vanguard Total Stock Market</span>
          </div>
          <div className={boxStyle}>
            <img src="/other-img/invesco logo.jpg" alt="Invesco" className={imgStyle} />
            <span className="font-medium text-black text-center block w-full py-2 bg-white bg-opacity-90">Invesco</span>
          </div>
          <div className={boxStyle}>
            <img src="/other-img/VANGUARDS&P.png" alt="Vanguard" className={imgStyle} />
            <span className="font-medium text-black text-center block w-full py-2 bg-white bg-opacity-90">Vanguard</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stocks;
