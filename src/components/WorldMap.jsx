import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const geoUrl =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const WorldMap = ({ highlightCountries }) => {
  const navigate = useNavigate();
  
  const allHighlighted = highlightCountries?.all || [];
  const topCountry = highlightCountries?.top || null;

  const handleSelect = (code) => {
    if (code && code !== '-99' && code.length >= 2) {
      navigate(`/universities/${code}`);
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
      >
        <ComposableMap 
          projectionConfig={{ scale: 160 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                // Try multiple property names for country code (prioritize ISO_A2 for 2-letter codes)
                const rawCode = geo.properties.ISO_A2 || geo.properties.ISO_A2_EH || geo.properties.ISO_A3;
                
                // Normalize code to uppercase for comparison (universities use uppercase codes like "US", "GB")
                const code = rawCode ? rawCode.toUpperCase() : null;
                
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
                
                // Normalize highlighted countries and top country for comparison
                const normalizedHighlighted = allHighlighted.map(c => c?.toUpperCase());
                const normalizedTopCountry = topCountry?.toUpperCase();
                
                const isActive = normalizedHighlighted.includes(code);
                const isTopCountry = code === normalizedTopCountry;
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      handleSelect(code);
                    }}
                    style={{
                      default: {
                        fill: isTopCountry 
                          ? '#ffd18c' 
                          : isActive 
                            ? '#87f5d6' 
                            : '#1f2937',
                        outline: 'none',
                        stroke: isTopCountry ? '#ffd18c' : '#111827',
                        strokeWidth: isTopCountry ? 1.5 : 0.5,
                        cursor: 'pointer',
                      },
                      hover: {
                        fill: '#ffa7c3',
                        outline: 'none',
                        cursor: 'pointer',
                        stroke: '#ffa7c3',
                        strokeWidth: 1,
                      },
                      pressed: {
                        fill: '#ffd18c',
                        outline: 'none',
                        cursor: 'pointer',
                        stroke: '#ffd18c',
                        strokeWidth: 1.5,
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
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

