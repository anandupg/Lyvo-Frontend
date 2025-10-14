import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeekerLayout from '../../components/seeker/SeekerLayout';
import { ArrowLeft, MapPin, Star } from 'lucide-react';

const SeekerPropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const base = import.meta.env.VITE_PROPERTY_SERVICE_API_URL || 'http://localhost:3002';
        const resp = await fetch(`${base}/api/public/properties/${id}`);
        const data = await resp.json();
        if (!resp.ok || data?.success !== true) {
          throw new Error(data?.message || 'Failed to load property');
        }
        setProperty(data.property);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <SeekerLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading property…</p>
          </div>
        </div>
      </SeekerLayout>
    );
  }

  if (error || !property) {
    return (
      <SeekerLayout>
        <div className="max-w-5xl mx-auto p-6">
          <button onClick={() => navigate(-1)} className="mb-4 text-sm text-blue-600 hover:text-blue-800">← Back</button>
          <div className="p-6 bg-white border rounded-xl text-center">
            <div className="text-red-600 text-5xl mb-3">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Error</h2>
            <p className="text-gray-600">{error || 'Property not found'}</p>
          </div>
        </div>
      </SeekerLayout>
    );
  }

  // Flatten property.images object (front/back/hall/kitchen + gallery array) into a single array
  const imgArray = (() => {
    const imgs = [];
    const src = property.images || {};
    if (Array.isArray(property.images)) return property.images;
    if (src.front) imgs.push(src.front);
    if (src.back) imgs.push(src.back);
    if (src.hall) imgs.push(src.hall);
    if (src.kitchen) imgs.push(src.kitchen);
    if (Array.isArray(src.gallery)) imgs.push(...src.gallery);
    return imgs;
  })();

  return (
    <SeekerLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
        </div>

        {/* Title and Basics */}
        <div className="bg-white border rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{property.propertyName}</h1>
              <div className="mt-1 flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1" /> {property.address}
              </div>
              <div className="text-xs text-gray-500 mt-1">Lat: {property.latitude} • Lng: {property.longitude}</div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm">4.5</span>
              </div>
              <div className="text-lg font-semibold text-red-600">{property.rent ? `₹${Number(property.rent).toLocaleString()}` : 'Price not available'}</div>
            </div>
          </div>

          {imgArray.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {imgArray.slice(0, 8).map((img, idx) => (
                <img key={idx} src={img} alt={`Image ${idx+1}`} className="w-full h-32 object-cover rounded" />
              ))}
            </div>
          )}
        </div>

        {/* Amenities */}
        {property.amenities && Object.keys(property.amenities).some(k => property.amenities[k]) && (
          <div className="bg-white border rounded-xl p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h2>
            <div className="flex flex-wrap gap-2 text-sm">
              {Object.entries(property.amenities).filter(([,v]) => v === true).map(([k]) => (
                <span key={k} className="px-2 py-1 bg-gray-100 text-gray-700 rounded">{k}</span>
              ))}
            </div>
          </div>
        )}

        {/* Rooms */}
        <div className="bg-white border rounded-xl p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Rooms</h2>
          {Array.isArray(property.rooms) && property.rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.rooms.map((room) => (
                <div 
                  key={room._id} 
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/room/${room._id}`, { state: { fromPropertyId: id } })}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">Room {room.roomNumber} • {room.roomType}</p>
                      <p className="text-xs text-gray-500">Size: {room.roomSize} sq ft • Bed: {room.bedType} • Occ: {room.occupancy}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded ${room.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{room.isAvailable ? 'Available' : 'Not available'}</span>
                        {room.status && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-700 capitalize">{room.status}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">{room.rent ? `₹${room.rent.toLocaleString()}` : 'Ask price'}</span>
                  </div>
                  {(room.roomImage || room.toiletImage) && (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {room.roomImage && <img src={room.roomImage} alt="Room" className="h-24 w-full object-cover rounded" />}
                      {room.toiletImage && <img src={room.toiletImage} alt="Toilet" className="h-24 w-full object-cover rounded" />}
                    </div>
                  )}
                  {room.description && (
                    <p className="text-sm text-gray-700 mb-2">{room.description}</p>
                  )}
                  {room.amenities && Object.keys(room.amenities).some(k => room.amenities[k]) && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {Object.entries(room.amenities).filter(([,v]) => v === true).map(([k]) => (
                        <span key={k} className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">{k}</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    Click to view room details
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No rooms available.</p>
          )}
        </div>
      </div>
    </SeekerLayout>
  );
};

export default SeekerPropertyDetails;


