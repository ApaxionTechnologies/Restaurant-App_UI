import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './styles/QRFileUploader.css';
//import Header from './components/Header'; // ✅ correct if in same folder as src/components



export default function QRFileUploader() {
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState('');
  const [tableNumber, setTableNumber] = useState(1);
  const [qrSrc, setQrSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGenerateBtn, setShowGenerateBtn] = useState(false);

  const fileInputRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setFileURL(url);
      setQrSrc('');
      setShowGenerateBtn(true);
    }
  };

  const generateQR = () => {
    const qrData = `t${tableNumber}`;
    setLoading(true);
    QRCode.toDataURL(
      qrData,
      {
        errorCorrectionLevel: 'L',
        margin: 1,
        scale: 6,
        width: 180,
      },
      (err, url) => {
        if (err) return console.error(err);
        setQrSrc(url);
        setLoading(false);
        setShowGenerateBtn(false);
      }
    );
  };

  const handleRemove = () => {
    setFile(null);
    setFileURL('');
    setQrSrc('');
    setShowGenerateBtn(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrSrc;
    link.download = `Table-${tableNumber}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTableChange = (e) => {
    const table = e.target.value;
    setTableNumber(table);
    if (file && !qrSrc) setShowGenerateBtn(true);
  };

  return (
    <div className="qr-page-bg py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0" data-aos="fade-up">
              <div className="card-body">
                <h4 className="card-title text-center mb-4">📥 Upload & Generate Table QR</h4>

                <div className="mb-3">
                  <label className="form-label">Table Number</label>
                  <select
                    className="form-select"
                    value={tableNumber}
                    onChange={handleTableChange}
                  >
                    {[...Array(10).keys()].map((num) => (
                      <option key={num + 1} value={num + 1}>
                        Table {num + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Select File</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </div>

                {file && (
                  <div className="mt-4 p-3 bg-light rounded border">
                    <p>
                      <strong>📄 File:</strong> {file.name}
                    </p>
                    <p>
                      <strong>🍽️ Table:</strong> {tableNumber}
                    </p>
                    <a
                      href={fileURL}
                      download={file.name}
                      className="btn btn-outline-primary btn-sm mb-3"
                    >
                      ⬇️ Download File
                    </a>

                    {showGenerateBtn && (
                      <button className="btn btn-warning w-100 mb-3" onClick={generateQR}>
                        ⚙️ Generate QR Code
                      </button>
                    )}

                    {loading ? (
                      <div className="text-center my-3">
                        <div className="spinner-border text-primary" role="status" />
                      </div>
                    ) : (
                      qrSrc && (
                        <>
                          <div className="text-center my-3">
                            <img
                              src={qrSrc}
                              alt="QR Code"
                              ref={canvasRef}
                              className="img-fluid border border-2 rounded mb-2"
                              style={{ maxWidth: '200px', cursor: 'pointer' }}
                              data-bs-toggle="modal"
                              data-bs-target="#qrPreviewModal"
                            />
                          </div>

                          <button
                            className="btn btn-success w-100 mb-2"
                            onClick={downloadQRCode}
                          >
                            ⬇️ Download QR Code
                          </button>
                        </>
                      )
                    )}

                    <button className="btn btn-outline-danger w-100" onClick={handleRemove}>
                      ❌ Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Preview */}
      <div className="modal fade" id="qrPreviewModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0">
            <div className="modal-header">
              <h5 className="modal-title">QR Code Preview</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body text-center">
              <img
                src={qrSrc}
                alt="QR Code Full"
                className="img-fluid border border-3 rounded"
                style={{ maxWidth: '300px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
