
import "./cupLoader.css"

const TeaLoader = () => {
  return (
    <div className="loaderContainer">
      <div className="loaderWrapper">
        
        <div className="loaderTeapot">
          
          <div className="loaderTeapotBody"></div>
          
          <div className="loaderTeapotSpout"></div>
          
          <div className="loaderTeapotHandle"></div>
          
          <div className="loaderTeapotLid"></div>
          
          <div className="loaderTeaStream"></div>
        </div>
        
        
        <div className="loaderCup">
          
          <div className="loaderCupBody">
            
            <div className="loaderTeaFill"></div>
          </div>
          
          <div className="loaderCupHandle"></div>
          
          <div className="loaderSaucer"></div>
        </div>
      </div>
      
      <div className="loaderText">Brewing your experience...</div>
    
    </div>
  );
};

export default TeaLoader;