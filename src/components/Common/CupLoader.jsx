
import "./cupLoader.css"

const TeaLoader = () => {
  return (
    <div className="loaderContainer">
      <div className="loaderWrapper">
        {/* Teapot */}
        <div className="loaderTeapot">
          {/* Teapot body */}
          <div className="loaderTeapotBody"></div>
          {/* Teapot spout */}
          <div className="loaderTeapotSpout"></div>
          {/* Teapot handle */}
          <div className="loaderTeapotHandle"></div>
          {/* Teapot lid */}
          <div className="loaderTeapotLid"></div>
          {/* Tea stream */}
          <div className="loaderTeaStream"></div>
        </div>
        
        {/* Cup */}
        <div className="loaderCup">
          {/* Cup body */}
          <div className="loaderCupBody">
            {/* Tea fill animation */}
            <div className="loaderTeaFill"></div>
          </div>
          {/* Cup handle */}
          <div className="loaderCupHandle"></div>
          {/* Cup saucer */}
          <div className="loaderSaucer"></div>
        </div>
      </div>
      
      <div className="loaderText">Brewing your experience...</div>
    
    </div>
  );
};

export default TeaLoader;