import React from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Map UN M49 numeric codes to ISO alpha-2 codes
const numericToISO = {
  '004': 'AF', '008': 'AL', '012': 'DZ', '016': 'AS', '020': 'AD',
  '024': 'AO', '028': 'AG', '032': 'AR', '036': 'AU', '040': 'AT',
  '044': 'BS', '048': 'BH', '050': 'BD', '051': 'AM', '052': 'BB',
  '056': 'BE', '060': 'BM', '064': 'BT', '068': 'BO', '070': 'BA',
  '072': 'BW', '076': 'BR', '084': 'BZ', '090': 'SB', '092': 'VG',
  '096': 'BN', '100': 'BG', '104': 'MM', '108': 'BI', '112': 'BY',
  '116': 'KH', '120': 'CM', '124': 'CA', '132': 'CV', '136': 'KY',
  '140': 'CF', '144': 'LK', '148': 'TD', '152': 'CL', '156': 'CN',
  '170': 'CO', '174': 'KM', '178': 'CG', '180': 'CD', '188': 'CR',
  '191': 'HR', '192': 'CU', '196': 'CY', '203': 'CZ', '204': 'BJ',
  '208': 'DK', '212': 'DM', '214': 'DO', '218': 'EC', '222': 'SV',
  '226': 'GQ', '231': 'ET', '232': 'ER', '233': 'EE', '242': 'FJ',
  '246': 'FI', '250': 'FR', '258': 'PF', '262': 'DJ', '266': 'GA',
  '268': 'GE', '270': 'GM', '275': 'PS', '276': 'DE', '288': 'GH',
  '296': 'KI', '300': 'GR', '308': 'GD', '320': 'GT', '324': 'GN',
  '328': 'GY', '332': 'HT', '340': 'HN', '348': 'HU', '352': 'IS',
  '356': 'IN', '360': 'ID', '364': 'IR', '368': 'IQ', '372': 'IE',
  '376': 'IL', '380': 'IT', '384': 'CI', '388': 'JM', '392': 'JP',
  '398': 'KZ', '400': 'JO', '404': 'KE', '408': 'KP', '410': 'KR',
  '414': 'KW', '417': 'KG', '418': 'LA', '422': 'LB', '426': 'LS',
  '428': 'LV', '430': 'LR', '434': 'LY', '438': 'LI', '440': 'LT',
  '442': 'LU', '450': 'MG', '454': 'MW', '458': 'MY', '462': 'MV',
  '466': 'ML', '470': 'MT', '478': 'MR', '480': 'MU', '484': 'MX',
  '492': 'MC', '496': 'MN', '498': 'MD', '499': 'ME', '504': 'MA',
  '508': 'MZ', '512': 'OM', '516': 'NA', '520': 'NR', '524': 'NP',
  '528': 'NL', '554': 'NZ', '558': 'NI', '562': 'NE', '566': 'NG',
  '578': 'NO', '583': 'FM', '584': 'MH', '585': 'PW', '586': 'PK',
  '591': 'PA', '598': 'PG', '600': 'PY', '604': 'PE', '608': 'PH',
  '616': 'PL', '620': 'PT', '624': 'GW', '626': 'TL', '634': 'QA',
  '642': 'RO', '643': 'RU', '646': 'RW', '659': 'KN', '662': 'LC',
  '670': 'VC', '674': 'SM', '678': 'ST', '682': 'SA', '686': 'SN',
  '688': 'RS', '690': 'SC', '694': 'SL', '702': 'SG', '703': 'SK',
  '704': 'VN', '705': 'SI', '706': 'SO', '710': 'ZA', '716': 'ZW',
  '724': 'ES', '728': 'SS', '729': 'SD', '740': 'SR', '748': 'SZ',
  '752': 'SE', '756': 'CH', '760': 'SY', '762': 'TJ', '764': 'TH',
  '768': 'TG', '776': 'TO', '780': 'TT', '784': 'AE', '788': 'TN',
  '792': 'TR', '795': 'TM', '798': 'TV', '800': 'UG', '804': 'UA',
  '807': 'MK', '818': 'EG', '826': 'GB', '831': 'GG', '832': 'JE',
  '833': 'IM', '834': 'TZ', '840': 'US', '854': 'BF', '858': 'UY',
  '860': 'UZ', '862': 'VE', '876': 'WF', '882': 'WS', '887': 'YE',
  '894': 'ZM',
};

const WorldMap = ({ highlightCountries }) => {
  const navigate = useNavigate();
  
  const allHighlighted = highlightCountries?.all || [];
  const topCountry = highlightCountries?.top || null;

  // Debug: Log what we're receiving
  console.log('🗺️ WorldMap received:', {
    allHighlighted,
    topCountry,
    highlightCountries
  });

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

              console.log('🔍 Normalized for map:', {
                normalizedHighlighted,
                normalizedTopCountry
              });

              // Log all country codes from the map (converted to ISO)
              const allMapCodes = geographies
                .map(g => numericToISO[g.id])
                .filter(Boolean);
              console.log('🗺️ All map country codes (ISO):', allMapCodes.slice(0, 20));
              
              return geographies.map((geo) => {
                // Convert numeric UN M49 code to ISO alpha-2
                const numericCode = geo.id;
                const code = numericToISO[numericCode] || null;
                
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

                // Debug specific countries
                if (code === 'US' || code === 'GB' || isActive || isTopCountry) {
                  console.log(`Country ${code}:`, {
                    numericCode,
                    isActive,
                    isTopCountry,
                    normalizedHighlighted,
                    normalizedTopCountry
                  });
                }

                // Determine fill color - prioritize hover, then top, then active
                let fillColor = '#1f2937'; // default dark gray
                let strokeColor = '#111827';
                let strokeWidth = 0.5;

                if (isTopCountry) {
                  // Top country gets gold highlight (most prominent)
                  fillColor = '#ffd18c'; // gold for top country
                  strokeColor = '#ffd18c';
                  strokeWidth = 2;
                  console.log(`✨ TOP COUNTRY ${code} - Setting gold color`);
                } else if (isActive) {
                  fillColor = '#87f5d6'; // teal for active countries
                  strokeColor = '#87f5d6';
                  strokeWidth = 1;
                  console.log(`✨ ACTIVE COUNTRY ${code} - Setting teal color`);
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleSelect(code);
                    }}
                    style={{
                      default: {
                        fill: fillColor,
                        stroke: strokeColor,
                        strokeWidth: strokeWidth,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      hover: {
                        fill: isTopCountry ? '#ffd18c' : isActive ? '#87f5d6' : '#ffa7c3',
                        stroke: isTopCountry ? '#ffd18c' : isActive ? '#87f5d6' : '#ffa7c3',
                        strokeWidth: isTopCountry ? 2 : isActive ? 1 : 1.5,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: '#ffd18c',
                        stroke: '#ffd18c',
                        strokeWidth: 2,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                    }}
                  />
                );
              });
            }}
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

