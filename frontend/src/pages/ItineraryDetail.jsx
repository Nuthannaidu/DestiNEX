import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import html2pdf from "html2pdf.js";

const ItineraryDetail = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const res = await axios.get(`/api/itineraries/${id}`);
        setItinerary(res.data);
      } catch (err) {
        console.error("Failed to fetch itinerary:", err);
      }
    };
    fetchItinerary();
  }, [id]);

  const handleDownload = () => {
    const element = document.getElementById("pdf-content");

    const images = element.querySelectorAll("img");
    const promises = [];

    images.forEach((img) => {
      if (!img.complete) {
        promises.push(
          new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          })
        );
      }
    });

    Promise.all(promises).then(() => {
      html2pdf()
        .set({
          margin: 0.5,
          filename: "itinerary.pdf",
          image: { type: "jpeg", quality: 1 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .from(element)
        .save();
    });
  };

  if (!itinerary) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <div>
          <h2 className="fw-bold">{itinerary.title}</h2>
          <p>
            {new Date(itinerary.startDate).toDateString()} -{" "}
            {new Date(itinerary.endDate).toDateString()}
          </p>
          <p className="text-muted">
            {itinerary.isPublic ? "Public" : "Private"} Itinerary
          </p>
        </div>
        <button className="btn btn-outline-primary mt-2" onClick={handleDownload}>
          Download PDF
        </button>
      </div>

      <div id="pdf-content">
        {itinerary.days.map((day, di) => (
          <div key={di} className="mb-4">
            <h4>{new Date(day.date).toDateString()}</h4>
            {day.activities.length === 0 && (
              <p className="text-muted">No activities planned for this day.</p>
            )}
            {day.activities.map((act, ai) => (
              <div key={ai} className="card mb-3 shadow-sm" style={{ overflow: 'hidden' }}>
                <div className="row g-0 align-items-center">
                  <div className="col-md-3">
                    {act.listing?.image?.url && (
                      <img
                        src={act.listing.image.url}
                        alt={act.listing.title}
                        className="img-fluid"
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                          borderTopLeftRadius: "0.5rem",
                          borderBottomLeftRadius: "0.5rem",
                        }}
                      />
                    )}
                  </div>
                  <div className="col-md-9 p-3">
                    <h5 className="card-title">{act.listing.title}</h5>
                    <p className="mb-1 text-muted">${act.listing.price}</p>
                    {act.note && <p className="mb-0"><strong>Note:</strong> {act.note}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDetail;
