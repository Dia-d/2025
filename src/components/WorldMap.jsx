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
              geographies.map((geo) => {
                const code = geo.properties.ISO_A2;
                const isActive = highlightCountries.includes(code);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleSelect(code)}
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
      <footer className="map-legend">
        <span className="legend-dot hot" />
        Universities align with your latest interests
      </footer>
    </section>
  );
};

export default WorldMap;

