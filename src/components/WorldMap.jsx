import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const geoUrl =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const WorldMap = ({ highlightCountries }) => {
  const navigate = useNavigate();

  const handleSelect = (code) => {
    navigate(`/universities/${code}`);
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
        <ComposableMap projectionConfig={{ scale: 160 }}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies
                .filter((geo) => {
                  // Filter out invalid geographies
                  const code = geo.properties.ISO_A2 || geo.properties.ISO_A2_EH || geo.properties.ISO_A3;
                  return code && code !== '-99' && code.length >= 2;
                })
                .map((geo) => {
                  // Try multiple property names for country code (prioritize ISO_A2 for 2-letter codes)
                  const code = geo.properties.ISO_A2 || geo.properties.ISO_A2_EH || geo.properties.ISO_A3;
                  const isActive = highlightCountries.includes(code);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => {
                        // Only navigate if we have a valid country code
                        const validCode = geo.properties.ISO_A2 || geo.properties.ISO_A2_EH || geo.properties.ISO_A3;
                        if (validCode && validCode !== '-99' && validCode.length >= 2) {
                          handleSelect(validCode);
                        }
                      }}
                      style={{
                        default: {
                          fill: isActive ? '#87f5d6' : '#1f2937',
                          outline: 'none',
                          stroke: '#111827',
                          strokeWidth: 0.5,
                        },
                        hover: {
                          fill: '#ffa7c3',
                          outline: 'none',
                        },
                        pressed: {
                          fill: '#ffd18c',
                          outline: 'none',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="legend-dot hot" />
          Universities align with your latest interests
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

