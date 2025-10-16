import React, { useEffect, useState, useRef } from "react";


const InfiniteScroll = ({ items, batchSize = 3, renderItem }) => {
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + batchSize, items.length));
        }
      },
      {
        root: null, 
        // rootMargin: "200px", // load early before reaching bottom
        // threshold: 0.1,
        rootMargin: "0px",  
        threshold: 1.0, 
      }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [items.length, batchSize]);

  return (
    <>
      {items.slice(0, visibleCount).map(renderItem)}
      {visibleCount < items.length && (
        <div
          ref={loaderRef}
          style={{
            height: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#888",
          }}
        >
          <div className="spinner-border text-secondary" role="status" style={{ width: "1.8rem", height: "1.8rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default InfiniteScroll;
