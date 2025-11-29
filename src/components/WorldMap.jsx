import { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const geoUrl =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const WorldMap = ({ highlightCountries }) => {
  const navigate = useNavigate();
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [mapError, setMapError] = useState(null);
  
  const allHighlighted = highlightCountries?.all || [];
  const topCountry = highlightCountries?.top || null;

  // Debug logging
  useEffect(() => {
    console.log('🗺️ WorldMap - Received highlight countries:', {
      all: allHighlighted,
      top: topCountry,
      count: allHighlighted.length,
      topInAll: topCountry ? allHighlighted.includes(topCountry) : false,
    });
  }, [allHighlighted, topCountry]);

  const handleSelect = (code) => {
    if (code && code !== '-99' && code.length >= 2) {
      console.log('Navigating to country:', code);
      navigate(`/universities/${code}`);
    } else {
      console.warn('Invalid country code:', code);
    }
  };

  return (
    <section id="map" className="panel map-panel">
      <header className="panel-header">
        <p className="eyebrow">Step 2</p>
        <h2>Tap any country to open its curated universities</h2>
        <p>The map reacts to your selected subjects to surface top matches.</p>
      </header>
      <motion.div
        className="map-shell"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ position: 'relative' }}
      >
        <ComposableMap 
          projectionConfig={{ scale: 160 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) => {
              if (!geographies || geographies.length === 0) {
                return (
                  <text x="50%" y="50%" textAnchor="middle" fill="var(--muted)">
                    Loading map...
                  </text>
                );
              }

              // Normalize highlighted countries once
              const normalizedHighlighted = allHighlighted
                .filter(Boolean)
                .map(c => String(c).toUpperCase().trim());
              const normalizedTopCountry = topCountry 
                ? String(topCountry).toUpperCase().trim() 
                : null;

              // Debug normalization
              if (normalizedTopCountry) {
                console.log('🔍 Normalized top country:', {
                  original: topCountry,
                  normalized: normalizedTopCountry,
                  inHighlighted: normalizedHighlighted.includes(normalizedTopCountry),
                  allHighlighted: normalizedHighlighted,
                });
              }

              return geographies.map((geo) => {
                // Try multiple property names for country code
                const rawCode = geo.properties.ISO_A2 
                  || geo.properties.ISO_A2_EH 
                  || geo.properties.ISO_A3
                  || geo.properties.NAME;
                
                // Normalize code to uppercase for comparison
                const code = rawCode ? String(rawCode).toUpperCase().trim() : null;
                
                // Skip invalid codes but still render the geography
                if (!code || code === '-99' || code.length < 2) {
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: '#1f2937',
                          outline: 'none',
                          stroke: '#111827',
                          strokeWidth: 0.5,
                        },
                      }}
                    />
                  );
                }
                
                const isActive = normalizedHighlighted.includes(code);
                const isTopCountry = code === normalizedTopCountry;
                const isHovered = hoveredCountry === code;

                // Determine fill color - prioritize hover, then top, then active
                let fillColor = '#1f2937'; // default dark gray
                let strokeColor = '#111827';
                let strokeWidth = 0.5;

                if (isHovered && !isTopCountry) {
                  // Hover takes priority unless it's the top country
                  fillColor = '#ffa7c3'; // pink on hover
                  strokeColor = '#ffa7c3';
                  strokeWidth = 1.5;
                } else if (isTopCountry) {
                  // Top country gets gold highlight (most prominent)
                  fillColor = '#ffd18c'; // gold for top country
                  strokeColor = '#ffd18c';
                  strokeWidth = 2; // Thicker stroke for visibility
                } else if (isActive) {
                  fillColor = '#87f5d6'; // teal for active countries
                  strokeColor = '#87f5d6';
                  strokeWidth = 1;
                }

                // Force update fill color in the style object
                const geographyStyle = {
                  default: {
                    fill: fillColor,
                    outline: 'none',
                    stroke: strokeColor,
                    strokeWidth: strokeWidth,
                    cursor: 'pointer',
                    pointerEvents: 'all',
                  },
                  hover: {
                    fill: '#ffa7c3',
                    outline: 'none',
                    cursor: 'pointer',
                    stroke: '#ffa7c3',
                    strokeWidth: 1.5,
                  },
                  pressed: {
                    fill: '#ffd18c',
                    outline: 'none',
                    cursor: 'pointer',
                    stroke: '#ffd18c',
                    strokeWidth: 2,
                  },
                };

                // Debug top country and active countries
                if (isTopCountry) {
                  console.log(`⭐ TOP COUNTRY ${code} styling:`, {
                    isActive,
                    isTopCountry,
                    isHovered,
                    fillColor,
                    strokeColor,
                    strokeWidth,
                    normalizedTopCountry,
                    normalizedHighlighted,
                  });
                } else if (isActive) {
                  console.log(`✨ Active country ${code} styling:`, {
                    isActive,
                    isTopCountry,
                    fillColor,
                    strokeColor,
                  });
                }
                
                return (
                  <Geography
                    key={`${geo.rsmKey}-${isActive}-${isTopCountry}`}
                    geography={geo}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleSelect(code);
                    }}
                    onMouseEnter={() => {
                      setHoveredCountry(code);
                    }}
                    onMouseLeave={() => {
                      setHoveredCountry(null);
                    }}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    style={geographyStyle}
                  />
                );
              });
            }}
          </Geographies>
        </ComposableMap>
        {mapError && (
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)',
            color: '#ef4444',
            textAlign: 'center',
            padding: '1rem',
            background: 'rgba(0, 0, 0, 0.8)',
            borderRadius: '0.5rem',
          }}>
            {mapError}
          </div>
        )}
      </motion.div>
      <footer className="map-legend" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {topCountry && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="legend-dot" style={{ background: '#ffd18c' }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
                Top match: {topCountry}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="legend-dot hot" />
            <span style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
              Universities align with your latest interests
            </span>
          </div>
        </div>
        <button 
          className="ghost-button" 
          type="button"
          onClick={() => navigate('/universities/global')}
        >
          Skip to All Universities
        </button>
      </footer>
    </section>
  );
};

export default WorldMap;

