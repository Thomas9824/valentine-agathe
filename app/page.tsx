"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [yesPosition, setYesPosition] = useState({ x: 0, y: 0 });
  const [yesPopupPosition, setYesPopupPosition] = useState({ x: 0, y: 0 });
  const [isNoChecked, setIsNoChecked] = useState(false);
  const [showSadPopup, setShowSadPopup] = useState(false);
  const [showOrangePopup, setShowOrangePopup] = useState(false);
  const [showYellowPopup, setShowYellowPopup] = useState(false);
  const [isYesPopupHovered, setIsYesPopupHovered] = useState(false);
  const [isYesOrangeHovered, setIsYesOrangeHovered] = useState(false);
  const [noPositions, setNoPositions] = useState<Array<{ x: number; y: number; rotation: number }>>([]);
  const yesBoxRef = useRef<HTMLDivElement>(null);
  const yesPopupBoxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const initialPositionRef = useRef<{ x: number; y: number } | null>(null);
  const initialPopupPositionRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Stocker la position initiale de la case "Yes" au chargement
    if (yesBoxRef.current && !initialPositionRef.current) {
      const rect = yesBoxRef.current.getBoundingClientRect();
      initialPositionRef.current = { x: rect.left, y: rect.top };
    }
  }, []);

  const isPositionOverlappingText = (x: number, y: number, boxWidth: number, boxHeight: number): boolean => {
    if (!textRef.current) return false;
    
    const textRect = textRef.current.getBoundingClientRect();
    const margin = 10;
    
    return !(
      x + boxWidth < textRect.left - margin ||
      x > textRect.right + margin ||
      y + boxHeight < textRect.top - margin ||
      y > textRect.bottom + margin
    );
  };

  const handleYesHover = () => {
    if (!yesBoxRef.current || !initialPositionRef.current) return;
    
    const boxRect = yesBoxRef.current.getBoundingClientRect();
    const boxWidth = boxRect.width;
    const boxHeight = boxRect.height;
    
    const margin = 30;
    
    let attempts = 0;
    let newAbsX, newAbsY;
    const maxAttempts = 100;
    
    do {
      newAbsX = margin + Math.random() * (window.innerWidth - boxWidth - 2 * margin);
      newAbsY = margin + Math.random() * (window.innerHeight - boxHeight - 2 * margin);
      
      attempts++;
    } while (isPositionOverlappingText(newAbsX, newAbsY, boxWidth, boxHeight) && attempts < maxAttempts);
    
    if (attempts >= maxAttempts) {
      if (!textRef.current) return;
      const textRect = textRef.current.getBoundingClientRect();
      
      const corners = [
        { x: margin, y: margin },
        { x: window.innerWidth - boxWidth - margin, y: margin },
        { x: margin, y: window.innerHeight - boxHeight - margin },
        { x: window.innerWidth - boxWidth - margin, y: window.innerHeight - boxHeight - margin },
      ];
      
      let bestCorner = corners[0];
      let maxDistance = 0;
      
      corners.forEach(corner => {
        if (!isPositionOverlappingText(corner.x, corner.y, boxWidth, boxHeight)) {
          const distance = Math.sqrt(
            Math.pow(corner.x - textRect.left, 2) + 
            Math.pow(corner.y - textRect.top, 2)
          );
          if (distance > maxDistance) {
            maxDistance = distance;
            bestCorner = corner;
          }
        }
      });
      
      newAbsX = bestCorner.x;
      newAbsY = bestCorner.y;
    }
    
    const relativeX = newAbsX - initialPositionRef.current.x;
    const relativeY = newAbsY - initialPositionRef.current.y;
    
    setYesPosition({ x: relativeX, y: relativeY });
  };

  const handleYesPopupEnter = () => {
    setIsYesPopupHovered(true);
  };

  const handleYesPopupLeave = () => {
    setIsYesPopupHovered(false);
  };

  const handleNoPopupClick = () => {
    setShowOrangePopup(true);
  };

  const closeOrangePopup = () => {
    setShowOrangePopup(false);
    setIsYesOrangeHovered(false);
    setNoPositions([]);
  };

  const handleYesOrangeHover = () => {
    setIsYesOrangeHovered(true);
    
    // Générer 100 positions aléatoires pour les "Non"
    const positions = [];
    for (let i = 0; i < 100; i++) {
      positions.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 360
      });
    }
    setNoPositions(positions);
  };

  const handleNoGreenClick = () => {
    setShowYellowPopup(true);
  };

  const closeYellowPopup = () => {
    setShowYellowPopup(false);
  };

  const handleNoClick = () => {
    setIsNoChecked(true);
    setShowSadPopup(true);
  };

  const closePopup = () => {
    setShowSadPopup(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[rgb(218,223,208)]">
      <div className={`bg-[rgb(235,107,184)] p-12 overflow-visible transition-all duration-300 ${showSadPopup || showOrangePopup || showYellowPopup ? 'blur-sm' : ''}`}>
        <main className="flex flex-col items-center gap-16">
          <h1 ref={textRef} className="text-3xl md:text-5xl font-extrabold text-center text-[rgb(8, 22, 16)] tracking-wide" style={{ fontFamily: 'var(--font-bowlby-one-sc)' }}>
            Veux-tu être ma valentine agathe ?
          </h1>
          
          <div className="flex gap-16 relative overflow-visible">
            {/* Yes - Case qui bouge */}
            <div
              ref={yesBoxRef}
              onMouseEnter={handleYesHover}
              style={{
                transform: `translate(${yesPosition.x}px, ${yesPosition.y}px)`,
                transition: "transform 0.3s ease-out",
                fontFamily: 'var(--font-shadows-into-light)'
              }}
              className="flex flex-col items-center gap-3 cursor-pointer relative z-10"
            >
              <span className="text-4xl font-bold text-[rgb(8, 22, 16)]">Oui</span>
              <div className="relative">
                {/* Case à cocher dessinée à la main */}
                <svg width="50" height="50" viewBox="0 0 50 50" className="transform rotate-[-2deg]">
                  {/* Carré dessiné à la main */}
                  <path
                    d="M 8 8 Q 9 7 26 8 T 42 8 Q 43 9 42 26 T 42 42 Q 41 43 24 42 T 8 42 Q 7 41 8 24 T 8 8"
                    fill="none"
                    stroke="rgb(8, 22, 16)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* No - Case fixe */}
            <div
              onClick={handleNoClick}
              className="flex flex-col items-center gap-3 cursor-pointer"
              style={{ fontFamily: 'var(--font-shadows-into-light)' }}
            >
              <span className="text-4xl font-bold text-[rgb(8, 22, 16)]">Non</span>
              <div className="relative">
                {/* Case à cocher dessinée à la main */}
                <svg width="50" height="50" viewBox="0 0 50 50" className="transform rotate-[1deg]">
                  {/* Carré dessiné à la main */}
                  <path
                    d="M 8 8 Q 9 7 26 8 T 42 8 Q 43 9 42 26 T 42 42 Q 41 43 24 42 T 8 42 Q 7 41 8 24 T 8 8"
                    fill="none"
                    stroke="rgb(8, 22, 16)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Checkmark dessiné à la main (si coché) */}
                  {isNoChecked && (
                    <path
                      d="M 12 24 Q 14 26 18 30 Q 20 32 22 30 Q 28 22 34 14 Q 36 12 38 14"
                      fill="none"
                      stroke="rgb(8, 22, 16)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}
                </svg>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Popup triste */}
      {showSadPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50" onClick={closePopup}>
          <div className={`bg-[rgb(67,127,227)] p-8 max-w-lg overflow-visible transition-all duration-300 ${showOrangePopup || showYellowPopup ? 'blur-sm' : ''}`} onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center gap-8">
              <p className="text-2xl text-center text-[rgb(8, 22, 16)] font-bold" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                Oh non... pas cool ça <br />
                Mais tu peux encore changer d'avis
              </p>
              
              <div className="flex gap-12 relative overflow-visible py-4">
                {/* Oui - Case qui se transforme en Non au survol */}
                <div
                  ref={yesPopupBoxRef}
                  onMouseEnter={handleYesPopupEnter}
                  onMouseLeave={handleYesPopupLeave}
                  onClick={isYesPopupHovered ? handleNoPopupClick : undefined}
                  style={{
                    fontFamily: 'var(--font-shadows-into-light)',
                    transition: "all 0.3s ease-out"
                  }}
                  className="flex flex-col items-center gap-3 cursor-pointer relative z-10"
                >
                  <span className="text-3xl font-bold text-[rgb(8, 22, 16)] transition-all duration-300">
                    {isYesPopupHovered ? 'Non' : 'Oui'}
                  </span>
                  <div className="relative">
                    <svg width="45" height="45" viewBox="0 0 50 50" className="transform rotate-[-2deg]">
                      <path
                        d="M 8 8 Q 9 7 26 8 T 42 8 Q 43 9 42 26 T 42 42 Q 41 43 24 42 T 8 42 Q 7 41 8 24 T 8 8"
                        fill="none"
                        stroke="rgb(8, 22, 16)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Non - Case fixe */}
                <div
                  onClick={handleNoPopupClick}
                  className="flex flex-col items-center gap-3 cursor-pointer"
                  style={{ fontFamily: 'var(--font-shadows-into-light)' }}
                >
                  <span className="text-3xl font-bold text-[rgb(8, 22, 16)]">Non</span>
                  <div className="relative">
                    <svg width="45" height="45" viewBox="0 0 50 50" className="transform rotate-[1deg]">
                      <path
                        d="M 8 8 Q 9 7 26 8 T 42 8 Q 43 9 42 26 T 42 42 Q 41 43 24 42 T 8 42 Q 7 41 8 24 T 8 8"
                        fill="none"
                        stroke="rgb(8, 22, 16)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup verte */}
      {showOrangePopup && (
        <>
          <div className="fixed inset-0 flex items-center justify-center z-[60]" onClick={closeOrangePopup}>
            <div className={`bg-[rgb(63,141,65)] p-10 max-w-lg overflow-visible transition-all duration-300 ${showYellowPopup ? 'blur-sm' : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col items-center gap-8">
                <p className="text-2xl text-center text-[rgb(8, 22, 16)] font-bold" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                  Vraiment ? Tu es sûre agathe ?<br />
                  Dernière chance...
                </p>
                
                <div className="flex gap-12 relative overflow-visible py-4">
                  {/* Oui - Disparaît au survol */}
                  {!isYesOrangeHovered && (
                    <div
                      onMouseEnter={handleYesOrangeHover}
                      className="flex flex-col items-center gap-3 cursor-pointer"
                      style={{ fontFamily: 'var(--font-shadows-into-light)' }}
                    >
                      <span className="text-3xl font-bold text-[rgb(8, 22, 16)]">Oui</span>
                      <div className="relative">
                        <svg width="45" height="45" viewBox="0 0 50 50" className="transform rotate-[-2deg]">
                          <path
                            d="M 8 8 Q 9 7 26 8 T 42 8 Q 43 9 42 26 T 42 42 Q 41 43 24 42 T 8 42 Q 7 41 8 24 T 8 8"
                            fill="none"
                            stroke="rgb(8, 22, 16)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Non */}
                  <div
                    onClick={handleNoGreenClick}
                    className="flex flex-col items-center gap-3 cursor-pointer"
                    style={{ fontFamily: 'var(--font-shadows-into-light)' }}
                  >
                    <span className="text-3xl font-bold text-[rgb(8, 22, 16)]">Non</span>
                    <div className="relative">
                      <svg width="45" height="45" viewBox="0 0 50 50" className="transform rotate-[1deg]">
                        <path
                          d="M 8 8 Q 9 7 26 8 T 42 8 Q 43 9 42 26 T 42 42 Q 41 43 24 42 T 8 42 Q 7 41 8 24 T 8 8"
                          fill="none"
                          stroke="rgb(8, 22, 16)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Popup jaune */}
      {showYellowPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-[70]" onClick={closeYellowPopup}>
          <div className="bg-[rgb(220,218,81)] p-8 max-w-lg overflow-visible" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col items-center gap-8">
              <p className="text-3xl text-center text-[rgb(8, 22, 16)] font-bold" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                Pas grave parce que t'es deja ma valentine toute l'année ma douce <br />

<br />
                rdv le 14 février à 10h à la mairie de Périgueux <br />
                <br />
                non je rigole <br />
                <br />
                rdv le 14 février chez nous pour la best soirée de l'année <br />
              </p>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
