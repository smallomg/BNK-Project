import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './roadshare.css';

// PDF worker 설정
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
axios.defaults.baseURL = 'http://localhost:3001';

const RoadShare = () => {
  const [roadData, setRoadData] = useState(null);
  const [selectedContent, setSelectedContent] = useState('resume');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // PDF 관련 상태
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfBlob, setPdfBlob] = useState(null);

  useEffect(() => {
    const fetchRoadData = async () => {
      try {
        console.log('Fetching data for ID:', id);
        const response = await axios.get(`/api/roads/${id}`);
  
        if (!response.data) {
          throw new Error('데이터가 없습니다.');
        }
  
        setRoadData(response.data);
        
        if (response.data.Files) {
          let files;
          try {
            files = typeof response.data.Files === 'string' 
              ? JSON.parse(response.data.Files) 
              : response.data.Files;
  
            // selectedContent가 있고 files에 해당 컨텐츠가 있을 때만 PDF 로드
            if (selectedContent && files[selectedContent]) {
              await loadPdf(id, selectedContent);
            }
          } catch (parseErr) {
            console.error('Files parsing error:', parseErr);
            files = {};
          }
        }
      } catch (err) {
        console.error('Error details:', err.response?.data || err);
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRoadData();
  
    // cleanup
    return () => {
      if (pdfBlob) {
        URL.revokeObjectURL(pdfBlob);
        setPdfBlob(null);
      }
    };
  }, [id]); // id만 의존성으로 설정


  const loadPdf = async (postId, contentType) => {
    try {
      const response = await axios({
        url: `/api/roads/download/${postId}/${contentType}`,
        method: 'GET',
        responseType: 'blob',
      });
      
      if (pdfBlob) {
        URL.revokeObjectURL(pdfBlob);
      }
      setPdfBlob(URL.createObjectURL(response.data));
    } catch (err) {
      console.error('Error loading PDF:', err);
    }
  };
  

  const handleFileClick = async (contentType) => {
    if (contentType === selectedContent) return;
    setSelectedContent(contentType);
    setPageNumber(1);
    await loadPdf(id, contentType);
  };
  
  const handleFileDownload = async (fileType) => {
    try {
      if (!roadData?.Files) return;
      
      const files = typeof roadData.Files === 'string' 
        ? JSON.parse(roadData.Files) 
        : roadData.Files;
  
      const fileInfo = files[fileType];
      if (!fileInfo) return;
  
      const response = await axios({
        url: `/api/roads/download/${id}/${fileType}`,
        method: 'GET',
        responseType: 'blob',
      });
  
      const filename = fileInfo.originalName || `${roadData.Title}_${fileType}.pdf`;
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      alert('파일 다운로드에 실패했습니다.');
    }
  };
 
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };
 
  const previousPage = () => {
    setPageNumber(prevPageNumber => Math.max(prevPageNumber - 1, 1));
  };
 
  const nextPage = () => {
    setPageNumber(prevPageNumber => Math.min(prevPageNumber + 1, numPages));
  };
 
  const renderContent = () => {
    if (!roadData || !roadData.Files) {
      return (
        <div className="content-text">
          <h2>로드 공유</h2>
          <p>선택된 내용이 없습니다.</p>
        </div>
      );
    }
 
    let files;
    try {
      files = typeof roadData.Files === 'string' 
        ? JSON.parse(roadData.Files)
        : roadData.Files;
    } catch (err) {
      console.error('Files parsing error:', err);
      return (
        <div className="content-text">
          <h2>데이터 오류</h2>
          <p>파일 정보를 불러올 수 없습니다.</p>
        </div>
      );
    }
 
    if (!files[selectedContent]) {
      return (
        <div className="content-text">
          <h2>선택된 파일</h2>
          <p>파일을 찾을 수 없습니다.</p>
        </div>
      );
    }
 
    return (
      <div className="content-text file-content">
        <div className="content-header">
          <h2>{roadData.Subtitle}</h2>
          <div className="content-meta">
            <p>작성자: {roadData.Author}</p>
            <p>직무: {roadData.Type}</p>
            <p>학력: {roadData.Education}</p>
          </div>
        </div>
        <div className="content-body">
  <h3>
    {selectedContent === 'resume' ? '이력서' :
     selectedContent === 'coverLetter' ? '자기소개서' :
     '포트폴리오'}
  </h3>
  </div>
  {/* PDF 컨트롤 버튼 */}
  <div className="pdf-controls">
    <button 
      onClick={handleFileDownload.bind(null, selectedContent)}
      className="download-btn"
    >
      파일 다운로드
    </button>
  </div>

  {/* PDF 문서 뷰어 */}
  <div className="pdf-document-container">
    {pdfBlob && (
      <Document
        file={pdfBlob}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div>PDF 로딩 중...</div>}
        error={<div>PDF 로드 실패</div>}
      >
        <Page 
          pageNumber={pageNumber}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          scale={1.0}
        />
      </Document>
    )}
  </div>

  {/* PDF 네비게이션 컨트롤 */}
  {pdfBlob && (
    <div className="pdf-navigation-container">
      <div className="pdf-navigation">
        <button 
          onClick={previousPage}
          disabled={pageNumber <= 1}
          className="nav-button"
        >
          ◀ 이전
        </button>
        <div className="page-controls">
          <input
            type="number"
            className="page-input"
            min={1}
            max={numPages || 1}
            value={pageNumber}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value && value >= 1 && value <= numPages) {
                setPageNumber(value);
              }
            }}
          />
          <span className="pdf-page-info">/ {numPages}</span>
        </div>
        <button 
          onClick={nextPage}
          disabled={pageNumber >= numPages}
          className="nav-button"
        >
          다음 ▶
        </button>
      </div>
    </div>
  )}
</div>
       
    
    );
  };
 
  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return (
    <div className="error">
      <h2>오류가 발생했습니다</h2>
      <p>{error}</p>
      <button onClick={() => navigate('/other')}>목록으로 돌아가기</button>
    </div>
  );
  if (!roadData) return (
    <div className="not-found">
      <h2>게시글을 찾을 수 없습니다</h2>
      <button onClick={() => navigate('/other')}>목록으로 돌아가기</button>
    </div>
  );
 
  return (
    <>
      <div className="container">
        <div className="sidebar">
          <div className="profile-picture">
            {roadData.Title}
          </div>
          <div className="profile-info">
            <p className="author-name">{roadData.Author}</p>
            <p className="position">{roadData.Position}</p>
            <p className="education">{roadData.Education}</p>
          </div>
          <hr className="sidebar-divider" />
          <div className="file-section">
            {Object.keys(JSON.parse(roadData.Files) || {}).map(contentType => (
                <a 
                key={contentType}
                href="#"
                className={`file-link ${selectedContent === contentType ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleFileClick(contentType);
                }}
              >
                <i className={`fas ${
                  contentType === 'resume' ? 'fa-file-alt' :
                  contentType === 'coverLetter' ? 'fa-file-signature' :
                  'fa-briefcase'
                } file-icon`}></i>
                {contentType === 'resume' ? '이력서' :
                 contentType === 'coverLetter' ? '자기소개서' :
                 '포트폴리오'} 파일
              </a>
            ))}
          </div>
          <div className="banner-section">
            <img src="/api/placeholder/300/120" alt="배너 1" className="sidebar-banner" />
            <img src="/api/placeholder/300/120" alt="배너 2" className="sidebar-banner" />
          </div>
        </div>
        
        <div className="content">
          {renderContent()}
        </div>
      </div>
    </>
  );
 };
 
 export default RoadShare;