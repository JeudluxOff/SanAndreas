import { Layout } from "@/components/Layout";
import {
  Building2,
  ShieldCheck,
  HeartPulse,
  MapPin,
  Info,
  ChevronRight,
  Phone,
  Clock,
  ExternalLink,
  Users as UsersIcon,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Edit2,
  Copy,
  Check,
  Save
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface Location {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'government';
  description: string;
  coords: { top: string; left: string };
  address: string;
  phone: string;
}

const locations: Location[] = [
  {
    id: 'gov-palais',
    name: "Palais du Gouverneur",
    type: 'government',
    description: "Le centre du pouvoir exécutif de l'État de San Andreas. Bureaux du Gouverneur et du Cabinet.",
    coords: { top: '74.792%', left: '48.042%' },
    address: "Capital Boulevard, Los Santos",
    phone: "555-GOV-01"
  },
  {
    id: 'gov-doj',
    name: "Department of Justice (DOJ)",
    type: 'government',
    description: "Siège de l'autorité judiciaire. Cour supérieure et bureaux du Procureur Général.",
    coords: { top: '75.417%', left: '48.667%' },
    address: "Rockford Hills, Los Santos",
    phone: "555-DOJ-02"
  },
  {
    id: 'lspd-mission-row',
    name: "LSPD - Mission Row",
    type: 'police',
    description: "Quartier général de la police de Los Santos. Centre de commandement principal.",
    coords: { top: '74.829%', left: '53.543%' },
    address: "Mission Row, Los Santos",
    phone: "911-LSPD-01"
  },
  {
    id: 'lspd-vespucci',
    name: "LSPD - Vespucci",
    type: 'police',
    description: "Poste de police desservant les quartiers de Vespucci et Del Perro.",
    coords: { top: '73.508%', left: '40.767%' },
    address: "Vespucci Boulevard, Los Santos",
    phone: "911-LSPD-02"
  },
  {
    id: 'bcso-sandy-shores',
    name: "BCSO - Sandy Shores",
    type: 'police',
    description: "Bureau du shérif du comté de Blaine. Responsable de la sécurité rurale.",
    coords: { top: '35.975%', left: '65.458%' },
    address: "Alhambra Drive, Sandy Shores",
    phone: "911-BCSO-01"
  },
  {
    id: 'bcso-paleto-bay',
    name: "BCSO - Paleto Bay",
    type: 'police',
    description: "Poste avancé du shérif situé à l'extrémité nord de l'État.",
    coords: { top: '16.575%', left: '46.333%' },
    address: "Duluoz Avenue, Paleto Bay",
    phone: "911-BCSO-02"
  },
  {
    id: 'ems-central',
    name: "Central Los Santos Medical Center",
    type: 'hospital',
    description: "Hôpital principal de l'État, spécialisé dans les urgences chirurgicales.",
    coords: { top: '71.533%', left: '52.483%' },
    address: "Capital Boulevard, Los Santos",
    phone: "911-EMS-01"
  },
  {
    id: 'ems-mount-zonah',
    name: "Mount Zonah Medical Center",
    type: 'hospital',
    description: "Centre médical de renommée mondiale, leader en recherche et soins spécialisés.",
    coords: { top: '69.500%', left: '46.258%' },
    address: "Dorset Drive, Rockford Hills",
    phone: "911-EMS-02"
  },
  {
    id: 'ems-pillbox',
    name: "Pillbox Hill Medical Center",
    type: 'hospital',
    description: "Hôpital de proximité au cœur du centre-ville, ouvert 24h/24.",
    coords: { top: '78.608%', left: '52.558%' },
    address: "Elgin Avenue, Los Santos",
    phone: "911-EMS-03"
  },
  {
    id: 'ems-sandy-shores',
    name: "Sandy Shores Medical Center",
    type: 'hospital',
    description: "Seul centre de soins disponible dans la région du désert de Grand Senora.",
    coords: { top: '36.025%', left: '65.325%' },
    address: "Panorama Drive, Sandy Shores",
    phone: "911-EMS-04"
  }
];

export default function Services() {
  const [dynamicLocations, setDynamicLocations] = useState<Location[]>(locations);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [filter, setFilter] = useState<'all' | 'police' | 'hospital' | 'government'>('all');
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const [isDraggingMarker, setIsDraggingMarker] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isEditMode, setIsEditMode] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const filteredLocations = dynamicLocations.filter(loc =>
    filter === 'all' || loc.type === filter
  );

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) setOffset({ x: 0, y: 0 });
      return newZoom;
    });
  };
  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < 0) handleZoomIn();
      else handleZoomOut();
    };

    map.addEventListener('wheel', onWheel, { passive: false });
    return () => map.removeEventListener('wheel', onWheel);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditMode && isDraggingMarker) return;
    if (zoom > 1) {
      setIsDraggingMap(true);
      setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isEditMode && isDraggingMarker && mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      // Calculate position relative to the map container, accounting for zoom and offset
      const x = (e.clientX - rect.left - offset.x) / zoom;
      const y = (e.clientY - rect.top - offset.y) / zoom;

      const leftPercent = (x / rect.width) * 100;
      const topPercent = (y / rect.height) * 100;

      setDynamicLocations(prev => prev.map(loc =>
        loc.id === isDraggingMarker
          ? { ...loc, coords: { top: `${topPercent.toFixed(3)}%`, left: `${leftPercent.toFixed(3)}%` } }
          : loc
      ));

      // Update selected location if it's the one being dragged to show live coords
      if (selectedLocation?.id === isDraggingMarker) {
        setSelectedLocation(prev => prev ? {
          ...prev,
          coords: { top: `${topPercent.toFixed(3)}%`, left: `${leftPercent.toFixed(3)}%` }
        } : null);
      }
      return;
    }

    if (isDraggingMap && zoom > 1) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDraggingMap(false);
    setIsDraggingMarker(null);
  };

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isEditMode && isDraggingMarker) return;
    if (zoom > 1) {
      setIsDraggingMap(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isEditMode && isDraggingMarker && mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = (touch.clientX - rect.left - offset.x) / zoom;
      const y = (touch.clientY - rect.top - offset.y) / zoom;

      const leftPercent = (x / rect.width) * 100;
      const topPercent = (y / rect.height) * 100;

      setDynamicLocations(prev => prev.map(loc =>
        loc.id === isDraggingMarker
          ? { ...loc, coords: { top: `${topPercent.toFixed(3)}%`, left: `${leftPercent.toFixed(3)}%` } }
          : loc
      ));

      // Update selected location if it's the one being dragged to show live coords
      if (selectedLocation?.id === isDraggingMarker) {
        setSelectedLocation(prev => prev ? {
          ...prev,
          coords: { top: `${topPercent.toFixed(3)}%`, left: `${leftPercent.toFixed(3)}%` }
        } : null);
      }
      return;
    }

    if (isDraggingMap && zoom > 1) {
      const touch = e.touches[0];
      setOffset({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const copyToClipboard = () => {
    const code = JSON.stringify(dynamicLocations.map(l => ({ id: l.id, name: l.name, coords: l.coords })), null, 2);
    navigator.clipboard.writeText(code);
    toast.success("Coordonnées copiées dans le presse-papier !");
  };

  return (
    <Layout>
      <div className="bg-primary/5 py-16 border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-tighter">Services & Infrastructures</h1>
            <p className="text-xl text-slate-600 font-medium">
              Consultez la carte interactive de l'État pour localiser les services de secours et de sécurité publique à proximité.
            </p>
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Control Panel */}
            <div className="w-full lg:w-1/3 space-y-8 order-2 lg:order-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 space-y-6">
                <h3 className="text-xl font-black text-primary uppercase tracking-tight flex items-center gap-2">
                  <Info className="w-5 h-5 text-secondary" />
                  Filtres de recherche
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    variant={filter === 'all' ? 'default' : 'outline'}
                    className="justify-start h-12"
                    onClick={() => setFilter('all')}
                  >
                    Toutes les infrastructures
                  </Button>
                  <Button 
                    variant={filter === 'police' ? 'default' : 'outline'}
                    className={cn(
                      "justify-start h-12 border-2",
                      filter === 'police' ? "bg-primary border-primary" : "border-primary/20 text-primary"
                    )}
                    onClick={() => setFilter('police')}
                  >
                    <ShieldCheck className="mr-2 w-5 h-5" /> Postes de Police
                  </Button>
                  <Button
                    variant={filter === 'hospital' ? 'default' : 'outline'}
                    className={cn(
                      "justify-start h-12 border-2",
                      filter === 'hospital' ? "bg-secondary border-secondary" : "border-secondary/20 text-secondary"
                    )}
                    onClick={() => setFilter('hospital')}
                  >
                    <HeartPulse className="mr-2 w-5 h-5" /> Hôpitaux & EMS
                  </Button>
                  <Button
                    variant={filter === 'government' ? 'default' : 'outline'}
                    className={cn(
                      "justify-start h-12 border-2",
                      filter === 'government' ? "bg-slate-700 border-slate-700" : "border-slate-300 text-slate-700"
                    )}
                    onClick={() => setFilter('government')}
                  >
                    <Building2 className="mr-2 w-5 h-5" /> Gouvernement & DOJ
                  </Button>
                </div>
              </div>

              {/* Admin Tools */}
              <div className="bg-slate-900 p-6 rounded-lg shadow-xl border border-white/10 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-secondary" />
                  Outils d'Administration
                </h3>
                <div className="flex flex-col gap-2">
                  <Button
                    variant={isEditMode ? "secondary" : "outline"}
                    className={cn(
                      "w-full justify-start h-10 text-xs font-bold uppercase tracking-widest",
                      isEditMode ? "bg-secondary text-white border-none" : "text-white border-white/20 hover:bg-white/5"
                    )}
                    onClick={() => setIsEditMode(!isEditMode)}
                  >
                    {isEditMode ? <Check className="mr-2 w-4 h-4" /> : <Edit2 className="mr-2 w-4 h-4" />}
                    {isEditMode ? "Quitter l'édition" : "Activer l'édition"}
                  </Button>
                  {isEditMode && (
                    <Button
                      variant="outline"
                      className="w-full justify-start h-10 text-xs font-bold uppercase tracking-widest text-white border-white/20 hover:bg-white/5"
                      onClick={copyToClipboard}
                    >
                      <Copy className="mr-2 w-4 h-4" />
                      Copier les positions
                    </Button>
                  )}
                </div>
                {isEditMode && (
                  <p className="text-[10px] text-slate-400 font-medium italic">
                    En mode édition, maintenez le clic sur un point pour le déplacer. Utilisez le bouton ci-dessus pour récupérer les nouvelles coordonnées.
                  </p>
                )}
              </div>

              {selectedLocation ? (
                <div className="bg-white p-8 rounded-lg shadow-xl border-t-4 border-secondary animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      {selectedLocation.type === 'police' ?
                        <ShieldCheck className="w-8 h-8 text-primary" /> :
                        selectedLocation.type === 'hospital' ?
                        <HeartPulse className="w-8 h-8 text-secondary" /> :
                        <Building2 className="w-8 h-8 text-slate-700" />
                      }
                      <h3 className="text-2xl font-black text-primary uppercase tracking-tight leading-none">
                        {selectedLocation.name}
                      </h3>
                    </div>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {selectedLocation.description}
                    </p>
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      {isEditMode && selectedLocation && (
                        <div className="p-3 bg-secondary/10 border border-secondary/20 rounded text-[10px] font-mono font-bold text-secondary space-y-1">
                          <p className="uppercase tracking-tighter">Outils Édition : Coordonnées Live</p>
                          <p>Top: {selectedLocation.coords.top}</p>
                          <p>Left: {selectedLocation.coords.left}</p>
                        </div>
                      )}
                      <div className="flex items-start gap-3 text-sm">
                        <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        <span className="font-bold text-slate-700">{selectedLocation.address}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        <span className="font-bold text-slate-700">{selectedLocation.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        <span className="font-bold text-green-600 uppercase tracking-widest text-[10px]">Ouvert 24h/24 - 7j/7</span>
                      </div>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 uppercase">
                      Itinéraire GPS
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-100 p-8 rounded-lg border-2 border-dashed border-slate-300 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="w-8 h-8 text-slate-400" />
                  </div>
                  <h4 className="text-lg font-black text-slate-400 uppercase tracking-tighter">Sélectionnez un point</h4>
                  <p className="text-slate-400 text-sm font-medium">
                    Cliquez sur une icône sur la carte pour voir les détails du bâtiment public.
                  </p>
                </div>
              )}
            </div>

            {/* Map Area */}
            <div className="w-full lg:w-2/3 order-1 lg:order-2">
              <div
                ref={mapRef}
                className={cn(
                  "relative aspect-square bg-slate-950 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(30,58,138,0.2)] border-4 border-white ring-1 ring-slate-200 group transition-all",
                  zoom > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
                )}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
              >
                {/* Tactical Scanlines Effect Overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-30" style={{
                  backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                  backgroundSize: '100% 2px, 3px 100%'
                }} />

                {/* Transform Container */}
                <div
                  className="absolute inset-0 transition-transform duration-200 ease-out"
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    transformOrigin: 'center'
                  }}
                >
                  {/* Simulated Map Background */}
                  <div className="absolute inset-0 opacity-80">
                    <img
                      src="https://www.bragitoff.com/wp-content/uploads/2015/11/GTAV_ATLUS_8192x8192.png"
                      alt="San Andreas Map Background"
                      className="w-full h-full object-cover grayscale-[40%] brightness-[0.8] contrast-[1.1]"
                    />
                  </div>

                  {/* Map Grid / Topographic lines simulation */}
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="w-full h-full" style={{
                      backgroundImage: 'radial-gradient(circle, white 0.5px, transparent 0.5px)',
                      backgroundSize: '20px 20px'
                    }} />
                  </div>

                  {/* Markers Overlay */}
                  <div className="absolute inset-0 p-8 md:p-12">
                    <div className="relative w-full h-full">
                      {filteredLocations.map((loc) => (
                        <button
                          key={loc.id}
                          className={cn(
                            "absolute transition-all duration-300 z-10",
                            selectedLocation?.id === loc.id ? "z-20 scale-125" : "z-10 hover:scale-110",
                            isEditMode && "cursor-move"
                          )}
                          style={{
                            top: loc.coords.top,
                            left: loc.coords.left,
                            // Keep markers the same pixel size as zoom increases while maintaining centering
                            transform: `translate(-50%, -50%) scale(${1 / zoom})`
                          }}
                          onMouseDown={(e) => {
                            if (isEditMode) {
                              e.stopPropagation();
                              setIsDraggingMarker(loc.id);
                              setSelectedLocation(loc);
                            }
                          }}
                          onClick={(e) => {
                            if (!isEditMode) {
                              e.stopPropagation();
                              setSelectedLocation(loc);
                            }
                          }}
                        >
                          <div className={cn(
                            "relative p-2.5 rounded-full shadow-lg border-2 border-white animate-pulse-slow",
                            loc.type === 'police' ? "bg-primary text-white" :
                            loc.type === 'hospital' ? "bg-secondary text-white" :
                            "bg-slate-700 text-white",
                            selectedLocation?.id === loc.id && "animate-none ring-4 ring-white/30"
                          )}>
                            {loc.type === 'police' ?
                              <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" /> :
                              loc.type === 'hospital' ?
                              <HeartPulse className="w-5 h-5 md:w-6 md:h-6" /> :
                              <Building2 className="w-5 h-5 md:w-6 md:h-6" />
                            }

                            {/* Label on Hover / Selected */}
                            {(selectedLocation?.id === loc.id) && (
                              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap bg-slate-900/90 text-white px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-widest shadow-2xl border border-white/20 backdrop-blur-sm z-50">
                                {loc.name}
                              </div>
                            )}
                          </div>

                          {/* Radar Effect for Selected */}
                        {selectedLocation?.id === loc.id && (
                          <div className={cn(
                            "absolute inset-0 rounded-full animate-ping opacity-50",
                            loc.type === 'police' ? "bg-primary" :
                            loc.type === 'hospital' ? "bg-secondary" :
                            "bg-slate-700"
                          )} />
                        )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Zoom Controls */}
                <div className="absolute top-6 left-6 flex flex-col gap-2 z-40">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-slate-900/90 text-white border border-white/20 hover:bg-primary shadow-xl"
                    onClick={handleZoomIn}
                  >
                    <ZoomIn className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-slate-900/90 text-white border border-white/20 hover:bg-primary shadow-xl"
                    onClick={handleZoomOut}
                  >
                    <ZoomOut className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="bg-slate-900/90 text-white border border-white/20 hover:bg-secondary shadow-xl"
                    onClick={handleReset}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                </div>

                {/* Map Legend */}
                <div className="absolute bottom-6 left-6 bg-slate-900/90 backdrop-blur-md p-4 rounded border border-white/20 flex gap-6 z-30 shadow-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_8px_rgba(30,58,138,0.8)]" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">LSPD / BCSO</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-secondary rounded-full shadow-[0_0_8px_rgba(200,16,46,0.8)]" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Hôpitaux / EMS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-slate-700 rounded-full shadow-[0_0_8px_rgba(51,65,85,0.8)]" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Gouv. / DOJ</span>
                  </div>
                </div>
                
                {/* Watermark */}
                <div className="absolute top-6 right-6 flex flex-col items-end opacity-60">
                  <span className="text-xl font-black text-white uppercase tracking-tighter drop-shadow-lg font-mono">SAN ANDREAS</span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-[0.4em] drop-shadow-md font-mono">MAP SYSTEM v4.2</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Quick Services Section */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-4xl font-black text-primary uppercase tracking-tighter">Services aux Citoyens</h2>
            <div className="w-24 h-2 bg-secondary mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Licences & Permis", 
                icon: <Building2 className="w-10 h-10 text-primary" />,
                desc: "Demandes de permis de port d'arme, licences d'entreprise et permis de construire."
              },
              { 
                title: "Rapports d'Incidents", 
                icon: <ShieldCheck className="w-10 h-10 text-primary" />,
                desc: "Déposez une plainte en ligne ou signalez un véhicule volé directement aux services compétents."
              },
              {
                title: "Recrutement",
                icon: <UsersIcon className="w-10 h-10 text-primary" />,
                desc: "Rejoignez les rangs du LSPD, BCSO ou EMS. Postulez dès aujourd'hui pour servir votre État."
              }
            ].map((service, idx) => (
              <div key={idx} className="p-10 bg-slate-50 border border-slate-200 rounded-lg hover:bg-white hover:shadow-xl hover:border-primary/20 transition-all group">
                <div className="mb-6">{service.icon}</div>
                <h3 className="text-2xl font-black text-primary uppercase tracking-tight mb-4">{service.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed mb-8">{service.desc}</p>
                <Link to="#" className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs group-hover:text-secondary transition-colors">
                  Accéder au formulaire <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}

// Add these custom animations to global.css or tailwind.config.ts if needed, 
// but for now let's assume standard shadcn-like animations are enough or we add them here via style tag if strictly necessary.
