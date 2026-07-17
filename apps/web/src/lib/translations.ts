export type Language = 'en' | 'es' | 'fr' | 'pt' | 'ar' | 'zh';

export interface TranslationSet {
  common: {
    networkStable: string;
    emergencyBroadcast: string;
    status: string;
    settings: string;
  };
  mission: {
    preShiftTag: string;
    welcomeTitle: string;
    welcomeDesc: string;
    startShift: string;
    checklistHeader: string;
    checklistLocations: string;
    attStadium: string;
    attSector: string;
    attReady: string;
    mbStadium: string;
    mbZone: string;
    mbPending: string;
    timelineHeader: string;
    timelineBriefing: string;
    timelineDeploy: string;
    timelineGatesOpen: string;
    timelineActive: string;
    transitRoutesHeader: string;
    taskCollectLanyard: string;
    taskVerifyComms: string;
    taskInspectBarriers: string;
    taskSyncBiometric: string;
    taskSecurityClearance: string;
    taskCalibrateDetectors: string;
    taskReviewVipRoster: string;
  };
  provision: {
    title: string;
    subtitle: string;
    osCheck: string;
    cameraCheck: string;
    securityToken: string;
    btnSync: string;
    syncing: string;
    done: string;
    pwaStatus: string;
    pwaDone: string;
  };
  auth: {
    title: string;
    subtitle: string;
    scanPrompt: string;
    faceId: string;
    touchId: string;
    orPin: string;
    pinDisplay: string;
    helpBtn: string;
    btnVerify: string;
  };
  calibrate: {
    title: string;
    subtitle: string;
    locationTarget: string;
    tier: string;
    sector: string;
    placeholderSector: string;
    supervisorHeader: string;
    supervisorSubtitle: string;
    diagnosticsHeader: string;
    diagnosticsSubtitle: string;
    testSiren: string;
    testVibe: string;
    testMic: string;
    testGps: string;
    btnTest: string;
    btnProceed: string;
  };
  deck: {
    title: string;
    subtitle: string;
    heatmapHeader: string;
    heatmapLive: string;
    directiveHeader: string;
    severityLabel: string;
    egressHeader: string;
    actionHeader: string;
    xaiHeader: string;
    btnAcknowledge: string;
    announcementHeader: string;
    btnCopyScript: string;
    targetAudience: string;
    simulatorHeader: string;
    simulatorDesc: string;
    simSafe: string;
    simSurgeC: string;
    simSurgeA: string;
    btnEndShift: string;
  };
  offramp: {
    title: string;
    subtitle: string;
    purgePrompt: string;
    equipmentHeader: string;
    equipmentBarcode: string;
    incidentHeader: string;
    incidentDesc: string;
    inputPlaceholder: string;
    btnWipe: string;
    wipeSuccess: string;
  };
  header: {
    liveFeed: string;
    gate: string;
    diag: string;
    signOut: string;
    accreditation: string;
    network: string;
    profile: string;
    layoutTooltip: string;
    googleLabs: string;
    techTeam: string;
  };
  sidebar: {
    missionControl: string;
    deviceGate: string;
    authPortal: string;
    calibration: string;
    offRamp: string;
    semiFinalOps: string;
  };
  mobileMenu: {
    navigation: string;
    interfaceLanguage: string;
    bentoGridView: string;
    bentoDesc: string;
    gridMode: string;
    listMode: string;
    syncLedgerReady: string;
    online: string;
  };
  modals: {
    qrTitle: string;
    qrSubtitle: string;
    qrScanPrompt: string;
    operatorName: string;
    securityAccess: string;
    securityLevel: string;
    zoneRange: string;
    netTitle: string;
    netSubtitle: string;
    netSpeed: string;
    netStable: string;
    ledgerCache: string;
    ledgerActive: string;
    pipeline: string;
    pipelineConnected: string;
    unsyncedQueue: string;
    unsyncedOps: string;
    btnPing: string;
    btnPinging: string;
    profileTitle: string;
    profileEmail: string;
    primaryAssignment: string;
    currentRole: string;
    roleAnnouncer: string;
    startCoords: string;
    biometricVerify: string;
    biometricEnrolled: string;
    btnReturn: string;
    btnProceedOfframp: string;
  };
  alerts: {
    cameraUnavailable: string;
    reportTooLong: string;
    reportSuccess: string;
    reportFailed: string;
    copiedScript: string;
    enrollingWebauthn: string;
    simulatingFaceid: string;
    copyScriptTitle: string;
    gateA: string;
    gateB: string;
    gateC: string;
    gateD: string;
    gatesAE: string;
    activeSteward: string;
  };
}

export const translations: Record<Language, TranslationSet> = {
  en: {
    common: {
      networkStable: "Network Stable",
      emergencyBroadcast: "Emergency Broadcast",
      status: "Telemetry Status",
      settings: "Settings",
    },
    mission: {
      preShiftTag: "Match Day -1 / Final Prep",
      welcomeTitle: "Welcome back, Operator.",
      welcomeDesc: "All systems nominal. Your next deployment is scheduled at Sector 7G. Review the critical checklists below before initiating your shift.",
      startShift: "Start Shift",
      checklistHeader: "Deployment Checklists",
      checklistLocations: "2 Locations",
      attStadium: "AT&T Stadium",
      attSector: "Sector 3, Arlington",
      attReady: "Ready",
      mbStadium: "Mercedes-Benz",
      mbZone: "Zone C, Atlanta",
      mbPending: "Pending",
      timelineHeader: "Match-Day Timeline",
      timelineBriefing: "HQ Briefing",
      timelineDeploy: "Deploy to Sectors",
      timelineGatesOpen: "Gates Open",
      timelineActive: "ACTIVE",
      transitRoutesHeader: "Transit Routes map",
      taskCollectLanyard: "Collect credential lanyard",
      taskVerifyComms: "Verify comms channel Alpha",
      taskInspectBarriers: "Inspect crowd-control barriers at Gate A",
      taskSyncBiometric: "Sync biometric scanner unit",
      taskSecurityClearance: "Awaiting security clearance code",
      taskCalibrateDetectors: "Calibrate metal detectors",
      taskReviewVipRoster: "Review VIP access roster",
    },
    provision: {
      title: "Device Provisioning Gate",
      subtitle: "Stadium cellular network is extremely congested. We are force-caching all maps, assets, and translation packs locally in the browser to ensure the app works in dead zones.",
      osCheck: "Operating System Version Check",
      cameraCheck: "QR Code Camera Access",
      securityToken: "WebAuthn Cryptography Simulator",
      btnSync: "Force Caching Assets & PWA",
      syncing: "Caching offline assets...",
      done: "Offline Bundle Fully Loaded",
      pwaStatus: "Installing background service worker...",
      pwaDone: "PWA registered locally.",
    },
    auth: {
      title: "Zero-Trust Identity Gate",
      subtitle: "Traditional passwords are useless in stadium environments. Log in instantly using your accreditation badge QR code or registered biometrics.",
      scanPrompt: "Hold your official accreditation QR code in front of the camera",
      faceId: "Scan Face ID",
      touchId: "Scan Fingerprint",
      orPin: "OR ENTER 6-DIGIT ACCREDITATION PIN",
      pinDisplay: "Accreditation Secure Code",
      helpBtn: "Accreditation broken? Get supervisor override.",
      btnVerify: "Verify PIN Code",
    },
    calibrate: {
      title: "Stadium Coordinates Calibration",
      subtitle: "Yes, you are assigned to Sector 7G. No, we cannot move you to the VIP box. Calibrate your device coordinates and run hardware tests to proceed.",
      locationTarget: "Your Operations Post",
      tier: "Stadium Seating Tier",
      sector: "Sector Designation ID",
      placeholderSector: "e.g. ALPHA-NORTH",
      supervisorHeader: "Supervisor Verification Code",
      supervisorSubtitle: "Show this rotating pin to your floor supervisor for live activation",
      diagnosticsHeader: "Hardware Health Diagnostics",
      diagnosticsSubtitle: "Verify your phone hardware actually works before entering live feed",
      testSiren: "Acoustic Siren Loop Check",
      testVibe: "Haptic Vibration Motor Check",
      testMic: "Microphone Crowd Analyzer",
      testGps: "GPS Coordinates Accuracy (< 5m)",
      btnTest: "Test Hardware Component",
      btnProceed: "Diagnostics Complete - Launch Operations",
    },
    deck: {
      title: "Unified Command Deck",
      subtitle: "Crowd levels are live. Gemini AI models are parsing sensor telemetries to issue direct action guidelines. Pay attention.",
      heatmapHeader: "Stadium Telemetry Heatmap",
      heatmapLive: "Live Flow Overlay",
      directiveHeader: "Active AI Directive Guideline",
      severityLabel: "SEVERITY LEVEL",
      egressHeader: "Assigned Egress Escape Paths",
      actionHeader: "Volunteer Marshal Action Steps",
      xaiHeader: "Explainable AI (XAI) Reason Chain",
      btnAcknowledge: "Acknowledge Instruction",
      announcementHeader: "Multilingual Crowd Broadcast Scripts",
      btnCopyScript: "Copy Announcement Script",
      targetAudience: "Primary Fan Language Segment",
      simulatorHeader: "Incident Scenarios Control",
      simulatorDesc: "Manually inject simulated bottlenecks to test the dynamic AI reasoning loop.",
      simSafe: "Reset: Optimal Flow Conditions",
      simSurgeC: "Surge Scenario: Gate C Overload",
      simSurgeA: "Surge Scenario: Gate A Checkpoint Blocked",
      btnEndShift: "Initiate Post-Shift Off-Ramp",
    },
    offramp: {
      title: "Secure Shift Off-Ramp",
      subtitle: "Shift completed. Do not keep the megaphones or chargers. Purge all internal stadium telemetry logs and cached maps before leaving.",
      purgePrompt: "Swipe slider below to securely wipe all databases, service workers, and cookies from this device.",
      equipmentHeader: "Hardware Checkout Protocol",
      equipmentBarcode: "Accreditation Checkout Barcode",
      incidentHeader: "End-of-Shift Incident Report",
      incidentDesc: "Briefly note any structural failures (e.g. broken handrails, loose barriers) noticed during your shift.",
      inputPlaceholder: "Enter structural anomalies or notes here...",
      btnWipe: "Wipe Local Storage & Sign Out",
      wipeSuccess: "Cache cleared. Safe travels.",
    },
    header: {
      liveFeed: "Live Feed",
      gate: "Gate",
      diag: "Diag",
      signOut: "Sign Out",
      accreditation: "Accreditation",
      network: "Network",
      profile: "Profile",
      layoutTooltip: "Toggle Layout View",
      googleLabs: "Google Labs",
      techTeam: "FIFA Tech Team"
    },
    sidebar: {
      missionControl: "Mission Control",
      deviceGate: "Device Gate",
      authPortal: "Auth Portal",
      calibration: "Calibration",
      offRamp: "Off-Ramp",
      semiFinalOps: "Semi-Final Operations"
    },
    mobileMenu: {
      navigation: "Navigation",
      interfaceLanguage: "Interface Language",
      bentoGridView: "Bento Grid View",
      bentoDesc: "Toggle compact single-column dashboard stack",
      gridMode: "Grid Mode",
      listMode: "List Mode",
      syncLedgerReady: "Offline Sync Ledger Ready",
      online: "ONLINE"
    },
    modals: {
      qrTitle: "Accreditation Badge",
      qrSubtitle: "Scan for terminal security checkpoint clearance",
      qrScanPrompt: "Hold your official accreditation QR code in front of the camera",
      operatorName: "Operator Name:",
      securityAccess: "Security Access:",
      securityLevel: "Level 5 (Ops)",
      zoneRange: "Zone Range:",
      netTitle: "Stadium Network Status",
      netSubtitle: "Live telemetry sync pipeline status",
      netSpeed: "Connection Speed:",
      netStable: "Stable",
      ledgerCache: "Ledger Offline Cache:",
      ledgerActive: "Active (IndexedDB)",
      pipeline: "Firestore Pipeline:",
      pipelineConnected: "CONNECTED (1Hz)",
      unsyncedQueue: "Unsynced Write Queue:",
      unsyncedOps: "Operations pending",
      btnPing: "Run Network Ping Test",
      btnPinging: "Pinging server...",
      profileTitle: "Operator Session",
      profileEmail: "steward.ops@fifa.com",
      primaryAssignment: "Primary Assignment:",
      currentRole: "Current Role:",
      roleAnnouncer: "Volunteer Announcer",
      startCoords: "Shift Start Coordinates:",
      biometricVerify: "Biometric Verification:",
      biometricEnrolled: "ENROLLED",
      btnReturn: "Return to Dashboard",
      btnProceedOfframp: "Proceed to Sign Out"
    },
    alerts: {
      cameraUnavailable: "Camera capability is unavailable or permission was denied. Zero-Trust Pin Fallback is active.",
      reportTooLong: "Report details exceed maximum length of 1000 characters.",
      reportSuccess: "Report logged successfully to central asset DB.",
      reportFailed: "Failed to submit report. Please check connection and retry.",
      copiedScript: "Announcement script copied!",
      enrollingWebauthn: "Simulating WebAuthn key binding... Done.",
      simulatingFaceid: "Simulating FaceID signature... Verified.",
      copyScriptTitle: "Copy script",
      gateA: "Gate A",
      gateB: "Gate B",
      gateC: "Gate C",
      gateD: "Gate D",
      gatesAE: "Gates A-E",
      activeSteward: "Active Steward"
    }
  },
  es: {
    common: {
      networkStable: "Red Estable",
      emergencyBroadcast: "Transmisión de Emergencia",
      status: "Estado Telemetría",
      settings: "Configuración",
    },
    mission: {
      preShiftTag: "Día del Partido -1 / Preparación Final",
      welcomeTitle: "Bienvenido de vuelta, Operador.",
      welcomeDesc: "Todos os sistemas operativos. Tu próximo despliegue está programado en el Sector 7G. Revisa las listas de verificación antes de comenzar.",
      startShift: "Iniciar Turno",
      checklistHeader: "Listas de Verificación",
      checklistLocations: "2 Ubicaciones",
      attStadium: "Estadio AT&T",
      attSector: "Sector 3, Arlington",
      attReady: "Listo",
      mbStadium: "Mercedes-Benz",
      mbZone: "Zona C, Atlanta",
      mbPending: "Pendiente",
      timelineHeader: "Cronograma del Partido",
      timelineBriefing: "Sesión Informativa",
      timelineDeploy: "Despliegue a Sectores",
      timelineGatesOpen: "Apertura de Puertas",
      timelineActive: "ACTIVO",
      transitRoutesHeader: "Mapa de Rutas de Tránsito",
      taskCollectLanyard: "Recoger credencial de cuello",
      taskVerifyComms: "Verificar canal de comunicaciones Alpha",
      taskInspectBarriers: "Inspeccionar barreras de control en Puerta A",
      taskSyncBiometric: "Sincronizar escáner biométrico",
      taskSecurityClearance: "Esperando código de seguridad",
      taskCalibrateDetectors: "Calibrar detectores de metales",
      taskReviewVipRoster: "Revisar lista de acceso VIP",
    },
    provision: {
      title: "Control de Dispositivos",
      subtitle: "La red del estadio está colapsada. Forzamos el almacenamiento local de todos los mapas y archivos para asegurar el funcionamiento sin señal.",
      osCheck: "Verificación de Sistema Operativo",
      cameraCheck: "Acceso a Cámara para QR",
      securityToken: "Simulación de token WebAuthn",
      btnSync: "Descargar Mapas y PWA",
      syncing: "Guardando recursos locales...",
      done: "Datos Locales Cargados",
      pwaStatus: "Instalando service worker...",
      pwaDone: "PWA registrada localmente.",
    },
    auth: {
      title: "Acceso de Seguridad Zero-Trust",
      subtitle: "Las contraseñas tradicionales son inútiles en eventos masivos. Inicia sesión escaneando tu credencial oficial o usando biometría.",
      scanPrompt: "Coloca el código QR de tu credencial frente a la cámara",
      faceId: "Escanear Face ID",
      touchId: "Escanear Huella",
      orPin: "O INGRESA PIN DE SEGURIDAD DE 6 DÍGITOS",
      pinDisplay: "Código Seguro de Acreditación",
      helpBtn: "¿Credencial rota? Solicita código al supervisor.",
      btnVerify: "Verificar Código PIN",
    },
    calibrate: {
      title: "Calibración de Coordenadas",
      subtitle: "Sí, estás asignado al Sector 7G. No, no te moveremos a los palcos VIP. Calibra tus coordenadas y verifica tus sensores.",
      locationTarget: "Puesto de Operaciones",
      tier: "Nivel de Gradas",
      sector: "Código de Sector Asignado",
      placeholderSector: "ej. ALPHA-NORTH",
      supervisorHeader: "Código de Verificación del Supervisor",
      supervisorSubtitle: "Muestra este PIN temporal a tu supervisor para ser activado",
      diagnosticsHeader: "Diagnóstico de Hardware",
      diagnosticsSubtitle: "Verifica que los sensores del teléfono funcionen antes de empezar",
      testSiren: "Prueba de Sirena Acústica",
      testVibe: "Prueba de Motor de Vibración",
      testMic: "Analizador de Ruido (Micrófono)",
      testGps: "Precisión de Ubicación GPS (< 5m)",
      btnTest: "Probar Componente",
      btnProceed: "Diagnóstico Exitoso - Entrar al Panel",
    },
    deck: {
      title: "Panel Operativo Central",
      subtitle: "Los flujo de multitudes están activos. La IA de Gemini analiza la telemetría en tiempo real y dicta comandos. Presta atención.",
      heatmapHeader: "Mapa Térmico del Estadio",
      heatmapLive: "Flujo de Gente en Tiempo Real",
      directiveHeader: "Directiva Activa de IA",
      severityLabel: "NIVEL DE GRAVEDAD",
      egressHeader: "Vías de Escape Sugeridas",
      actionHeader: "Plan de Acción del Voluntario",
      xaiHeader: "Cadena de Razonamiento IA (XAI)",
      btnAcknowledge: "Confirmar Instrucción",
      announcementHeader: "Anuncios Multilingües para Multitudes",
      btnCopyScript: "Copiar Guión de Anuncio",
      targetAudience: "Segmento de Idioma de Aficionados",
      simulatorHeader: "Simulador de Incidentes",
      simulatorDesc: "Inyecta congestión en las puertas para probar la capacidad de respuesta de la IA.",
      simSafe: "Restablecer: Tránsito Óptimo",
      simSurgeC: "Simular: Caos en Puerta C",
      simSurgeA: "Simular: Bloqueo en Puerta A",
      btnEndShift: "Finalizar Turno y Salir",
    },
    offramp: {
      title: "Salida y Des-provisión Segura",
      subtitle: "Turno completado. Devuelve los megáfonos y cargadores. Borra todos los datos del estadio antes de retirarte.",
      purgePrompt: "Desliza la barra para borrar base de datos, caché y cookies del dispositivo.",
      equipmentHeader: "Control de Equipos Devueltos",
      equipmentBarcode: "Código de Barras de Salida",
      incidentHeader: "Reporte Final de Turno",
      incidentDesc: "Reporta daños de infraestructura (ej. barandillas sueltas o barretas rotas) notados hoy.",
      inputPlaceholder: "Escribe anomalías estructurales aquí...",
      btnWipe: "Borrar Datos y Cerrar Sesión",
      wipeSuccess: "Memoria purgada. Buen viaje.",
    },
    header: {
      liveFeed: "Transmisión",
      gate: "Control",
      diag: "Diag",
      signOut: "Salir",
      accreditation: "Credencial",
      network: "Red",
      profile: "Perfil",
      layoutTooltip: "Cambiar Vista de Diseño",
      googleLabs: "Google Labs",
      techTeam: "Equipo Técnico FIFA"
    },
    sidebar: {
      missionControl: "Centro de Control",
      deviceGate: "Control de Dispositivos",
      authPortal: "Portal de Acceso",
      calibration: "Calibración",
      offRamp: "Salida Segura",
      semiFinalOps: "Operaciones de Semifinal"
    },
    mobileMenu: {
      navigation: "Navegación",
      interfaceLanguage: "Idioma de Interfaz",
      bentoGridView: "Vista Bento Grid",
      bentoDesc: "Cambiar a diseño de columna única compacta",
      gridMode: "Modo Cuadrícula",
      listMode: "Modo Lista",
      syncLedgerReady: "Sincronización Offline Lista",
      online: "EN LÍNEA"
    },
    modals: {
      qrTitle: "Credencial Oficial",
      qrSubtitle: "Escanee para autorización en el punto de control",
      qrScanPrompt: "Coloque el código QR frente a la cámara",
      operatorName: "Nombre de Operador:",
      securityAccess: "Acceso de Seguridad:",
      securityLevel: "Nivel 5 (Ops)",
      zoneRange: "Rango de Zona:",
      netTitle: "Estado de Red del Estadio",
      netSubtitle: "Estado de sincronización en tiempo real",
      netSpeed: "Velocidad de Conexión:",
      netStable: "Estable",
      ledgerCache: "Caché Offline:",
      ledgerActive: "Activo (IndexedDB)",
      pipeline: "Línea de Firestore:",
      pipelineConnected: "CONECTADO (1Hz)",
      unsyncedQueue: "Fila sin Sincronizar:",
      unsyncedOps: "operaciones pendientes",
      btnPing: "Probar Conexión de Red",
      btnPinging: "Probando servidor...",
      profileTitle: "Sesión de Operador",
      profileEmail: "steward.ops@fifa.com",
      primaryAssignment: "Asignación Primaria:",
      currentRole: "Rol Actual:",
      roleAnnouncer: "Locutor Voluntario",
      startCoords: "Coordenadas de Inicio:",
      biometricVerify: "Verificación Biométrica:",
      biometricEnrolled: "REGISTRADO",
      btnReturn: "Volver al Panel",
      btnProceedOfframp: "Proceder a Salida"
    },
    alerts: {
      cameraUnavailable: "La capacidad de la cámara no está disponible o se denegó el permiso. El PIN alternativo de Zero-Trust está activo.",
      reportTooLong: "Los detalles del informe exceden la longitud máxima de 1000 caracteres.",
      reportSuccess: "Informe registrado con éxito en la base de datos central de activos.",
      reportFailed: "Error al enviar el informe. Por favor, compruebe la conexión y vuelva a intentarlo.",
      copiedScript: "¡Guión del locutor copiado!",
      enrollingWebauthn: "Simulando vinculación de clave WebAuthn... Completado.",
      simulatingFaceid: "Simulando firma de FaceID... Verificado.",
      copyScriptTitle: "Copiar guión",
      gateA: "Puerta A",
      gateB: "Puerta B",
      gateC: "Puerta C",
      gateD: "Puerta D",
      gatesAE: "Puertas A-E",
      activeSteward: "Administrador Activo"
    }
  },
  fr: {
    common: {
      networkStable: "Réseau Stable",
      emergencyBroadcast: "Diffusion d'urgence",
      status: "Télémétrie",
      settings: "Paramètres",
    },
    mission: {
      preShiftTag: "Jour de Match J-1 / Préparation Finale",
      welcomeTitle: "Bienvenue, Opérateur.",
      welcomeDesc: "Tous les systèmes sont opérationnels. Votre prochain déploiement est prévu au Secteur 7G. Vérifiez les listes de contrôle avant de commencer.",
      startShift: "Démarrer le Service",
      checklistHeader: "Listes de Contrôle",
      checklistLocations: "2 Sites",
      attStadium: "Stade AT&T",
      attSector: "Secteur 3, Arlington",
      attReady: "Prêt",
      mbStadium: "Mercedes-Benz",
      mbZone: "Zone C, Atlanta",
      mbPending: "En Attente",
      timelineHeader: "Chronologie du Match",
      timelineBriefing: "Briefing QG",
      timelineDeploy: "Déploiement sur Secteurs",
      timelineGatesOpen: "Ouverture des Portes",
      timelineActive: "ACTIF",
      transitRoutesHeader: "Carte des Itinéraires de Transit",
      taskCollectLanyard: "Récupérer le badge accréditation",
      taskVerifyComms: "Vérifier le canal de communication Alpha",
      taskInspectBarriers: "Inspecter les barrières de contrôle au Portail A",
      taskSyncBiometric: "Synchroniser le scanner biométrique",
      taskSecurityClearance: "En attente du code de sécurité",
      taskCalibrateDetectors: "Calibrer les détecteurs de métaux",
      taskReviewVipRoster: "Consulter la liste d'accès VIP",
    },
    provision: {
      title: "Portail de Configuration",
      subtitle: "Le réseau du stade est saturé. Nous téléchargeons les cartes et fichiers en local pour garantir le bon fonctionnement sans connexion internet.",
      osCheck: "Vérification Système",
      cameraCheck: "Accès Caméra pour QR",
      securityToken: "Simulation de jeton WebAuthn",
      btnSync: "Télécharger les Fichiers & PWA",
      syncing: "Téléchargement des ressources...",
      done: "Cartes et Assets Synchronisés",
      pwaStatus: "Installation du service worker...",
      pwaDone: "PWA enregistrée localement.",
    },
    auth: {
      title: "Portail d'Accès Sécurisé",
      subtitle: "Les mots de passe traditionnels sont inutiles ici. Connectez-vous instantanément avec votre QR code d'accréditation ou par biométrie.",
      scanPrompt: "Présentez le QR code de votre accréditation devant la caméra",
      faceId: "Scanner Face ID",
      touchId: "Scanner l'empreinte",
      orPin: "OU ENTREZ LE CODE DE SÉCURITÉ À 6 CHIFFRES",
      pinDisplay: "Code d'Accréditation Sécurisé",
      helpBtn: "Accréditation endommagée? Obtenez le code superviseur.",
      btnVerify: "Vérifier le code PIN",
    },
    calibrate: {
      title: "Calibration du Secteur",
      subtitle: "Oui, vous êtes assigné au Secteur 7G. Non, vous ne pouvez pas aller dans les loges VIP. Calibrez les capteurs de votre appareil.",
      locationTarget: "Poste Assigné",
      tier: "Niveau des Tribunes",
      sector: "Code de Secteur",
      placeholderSector: "ex. ALPHA-NORTH",
      supervisorHeader: "Code Superviseur",
      supervisorSubtitle: "Présentez ce code dynamique à votre superviseur pour valider votre poste",
      diagnosticsHeader: "Diagnostic Matériel",
      diagnosticsSubtitle: "Vérifiez que votre téléphone fonctionne correctement avant de commencer",
      testSiren: "Test de Sirene Acoustique",
      testVibe: "Test du Vibreur Haptique",
      testMic: "Test du Microphone de Foule",
      testGps: "Précision de Localisation GPS (< 5m)",
      btnTest: "Tester le Capteur",
      btnProceed: "Diagnostic OK - Lancer la Mission",
    },
    deck: {
      title: "Deck de Commandement",
      subtitle: "Trafic en temps réel. L'IA Gemini analyse la télémétrie des capteurs et génère des consignes claires. Soyez attentifs.",
      heatmapHeader: "Carte Thermique du Stade",
      heatmapLive: "Visualisation en Direct",
      directiveHeader: "Consigne Active de l'IA",
      severityLabel: "DEGRÉ DE GRAVITÉ",
      egressHeader: "Voies d'Évacuation Suggérées",
      actionHeader: "Plan d'Action Volontaire",
      xaiHeader: "Explication de la Décision IA (XAI)",
      btnAcknowledge: "Confirmer l'Instruction",
      announcementHeader: "Annonces Multilingues de Foule",
      btnCopyScript: "Copier le Script d'Annonce",
      targetAudience: "Langue Cible des Supporters",
      simulatorHeader: "Simulateur d'Incidents",
      simulatorDesc: "Simulez des goulets d'étranglement pour valider le comportement du système IA.",
      simSafe: "Réinitialiser: Flux Normal",
      simSurgeC: "Simuler: Bouchon Porte C",
      simSurgeA: "Simuler: Obstacle Porte A",
      btnEndShift: "Fin de Service / Déconnexion",
    },
    offramp: {
      title: "Fin de Service Sécurisée",
      subtitle: "Service terminé. Restituez les mégaphones et batteries. Purgez toutes les données du stade avant de partir.",
      purgePrompt: "Faites glisser la barre pour effacer les bases de données locales, le cache et les cookies.",
      equipmentHeader: "Restitution Matériel",
      equipmentBarcode: "Code de Sortie Accréditation",
      incidentHeader: "Rapport d'Incident de Fin de Shift",
      incidentDesc: "Signalez tout problème matériel (barrières, rampes cassées) repéré aujourd'hui.",
      inputPlaceholder: "Rapportez les anomalies structurelles ici...",
      btnWipe: "Purger les Données & Quitter",
      wipeSuccess: "Mémoire purgée. Bon retour.",
    },
    header: {
      liveFeed: "Direct",
      gate: "Portail",
      diag: "Diag",
      signOut: "Quitter",
      accreditation: "Accréditation",
      network: "Réseau",
      profile: "Profil",
      layoutTooltip: "Changer de Vue",
      googleLabs: "Google Labs",
      techTeam: "Équipe Technique FIFA"
    },
    sidebar: {
      missionControl: "Mission de Contrôle",
      deviceGate: "Portail Appareil",
      authPortal: "Authentification",
      calibration: "Calibration",
      offRamp: "Fin de Service",
      semiFinalOps: "Opérations Demi-Finale"
    },
    mobileMenu: {
      navigation: "Navigation",
      interfaceLanguage: "Langue de l'Interface",
      bentoGridView: "Vue Grille Bento",
      bentoDesc: "Activer la colonne unique compacte",
      gridMode: "Mode Grille",
      listMode: "Mode Liste",
      syncLedgerReady: "Registre Hors-ligne Prêt",
      online: "EN LIGNE"
    },
    modals: {
      qrTitle: "Badge d'Accréditation",
      qrSubtitle: "Scanner pour l'accès de sécurité",
      qrScanPrompt: "Présentez le code QR devant la caméra",
      operatorName: "Nom de l'Opérateur:",
      securityAccess: "Accès Sécurité:",
      securityLevel: "Niveau 5 (Ops)",
      zoneRange: "Zone Assignée:",
      netTitle: "Statut Réseau du Stade",
      netSubtitle: "Statut du pipeline de télémétrie",
      netSpeed: "Vitesse Connexion:",
      netStable: "Stable",
      ledgerCache: "Cache Hors-ligne:",
      ledgerActive: "Actif (IndexedDB)",
      pipeline: "Pipeline Firestore:",
      pipelineConnected: "CONNECTÉ (1Hz)",
      unsyncedQueue: "Queue Non Synchronisée:",
      unsyncedOps: "opérations en attente",
      btnPing: "Lancer Test Connexion",
      btnPinging: "Connexion au serveur...",
      profileTitle: "Session Opérateur",
      profileEmail: "steward.ops@fifa.com",
      primaryAssignment: "Affectation Principale:",
      currentRole: "Rôle Actuel:",
      roleAnnouncer: "Annonceur Bénévole",
      startCoords: "Coordonnées de Service:",
      biometricVerify: "Vérification Biométrique:",
      biometricEnrolled: "ENREGISTRÉ",
      btnReturn: "Retour au Tableau",
      btnProceedOfframp: "Procéder à la Déconnexion"
    },
    alerts: {
      cameraUnavailable: "La fonction caméra n'est pas disponible ou l'autorisation a été refusée. Le PIN de secours Zero-Trust est actif.",
      reportTooLong: "Les détails du rapport dépassent la longueur maximale de 1000 caractères.",
      reportSuccess: "Rapport enregistré avec succès dans la base de données centrale des actifs.",
      reportFailed: "Échec de l'envoi du rapport. Veuillez vérifier la connexion et réessayer.",
      copiedScript: "Script de l'annonceur copié !",
      enrollingWebauthn: "Simulation de liaison de clé WebAuthn... Terminé.",
      simulatingFaceid: "Simulation de signature FaceID... Vérifié.",
      copyScriptTitle: "Copier le script",
      gateA: "Portail A",
      gateB: "Portail B",
      gateC: "Portail C",
      gateD: "Portail D",
      gatesAE: "Portails A-E",
      activeSteward: "Steward Actif"
    }
  },
  pt: {
    common: {
      networkStable: "Rede Estável",
      emergencyBroadcast: "Transmissão de Emergência",
      status: "Toda Telemetria",
      settings: "Configurações",
    },
    mission: {
      preShiftTag: "Dia do Jogo -1 / Preparação Final",
      welcomeTitle: "Bem-vindo de volta, Operador.",
      welcomeDesc: "Todos os sistemas operacionais. Seu próximo ponto de operação está no Setor 7G. Revise as listas de verificação antes de iniciar o turno.",
      startShift: "Iniciar Turno",
      checklistHeader: "Listas de Verificação",
      checklistLocations: "2 Locais",
      attStadium: "Estádio AT&T",
      attSector: "Setor 3, Arlington",
      attReady: "Pronto",
      mbStadium: "Mercedes-Benz",
      mbZone: "Zona C, Atlanta",
      mbPending: "Pendente",
      timelineHeader: "Cronograma do Dia de Jogo",
      timelineBriefing: "Reunião de Instrução",
      timelineDeploy: "Deslocamento para Setores",
      timelineGatesOpen: "Abertura dos Portões",
      timelineActive: "ATIVO",
      transitRoutesHeader: "Mapa de Rotas de Trânsito",
      taskCollectLanyard: "Retirar credencial de crachá",
      taskVerifyComms: "Verificar canal de comunicação Alpha",
      taskInspectBarriers: "Inspecionar barreiras de controle no Portão A",
      taskSyncBiometric: "Sincronizar scanner biométrico",
      taskSecurityClearance: "Aguardando código de liberação",
      taskCalibrateDetectors: "Calibrar detectores de metal",
      taskReviewVipRoster: "Revisar lista de acesso VIP",
    },
    provision: {
      title: "Registro de Dispositivo",
      subtitle: "A rede de dados do estádio está superlotada. Forçamos a gravação local de todos os mapas e arquivos no navegador para rodar offline.",
      osCheck: "Verificação do Sistema Operacional",
      cameraCheck: "Acesso de Câmera para o QR",
      securityToken: "Simulação de chave WebAuthn",
      btnSync: "Sincronizar Arquivos e PWA",
      syncing: "Salvando recursos locais...",
      done: "Mapas Locais Carregados",
      pwaStatus: "Instalando service worker de fundo...",
      pwaDone: "PWA registrada localmente.",
    },
    auth: {
      title: "Portal de Acesso Zero-Trust",
      subtitle: "Senhas tradicionais são inúteis no caos do estádio. Entre instantaneamente lendo seu crachá oficial ou por biometria.",
      scanPrompt: "Aponte o código QR de sua credencial oficial para a câmera",
      faceId: "Escanear Face ID",
      touchId: "Escanear Digital",
      orPin: "OU INSIRA O PIN DE SEGURANÇA DE 6 DÍGITOS",
      pinDisplay: "Código Seguro de Credenciamento",
      helpBtn: "Crachá danificado? Obtenha liberação do supervisor.",
      btnVerify: "Validar PIN de Acesso",
    },
    calibrate: {
      title: "Calibragem de Coordenadas",
      subtitle: "Sim, você está alocado no Setor 7G. No, não podemos te mandar para a tribuna VIP. Calibre seus sensores e teste os ruidômetros.",
      locationTarget: "Posto de Operações",
      tier: "Nível de Assentos",
      sector: "Código do Setor",
      placeholderSector: "ex. ALPHA-NORTH",
      supervisorHeader: "Código de Liberação do Supervisor",
      supervisorSubtitle: "Mostre esse código dinâmico ao supervisor de setor para ser ativado",
      diagnosticsHeader: "Diagnóstico de Hardware",
      diagnosticsSubtitle: "Verifique se a vibragem e o microfone do celular estão ativos",
      testSiren: "Verificação da Sirene de Áudio",
      testVibe: "Verificação do Vibreur Haptico",
      testMic: "Medidor de Ruído de Multidão",
      testGps: "Precisão Geográfica GPS (< 5m)",
      btnTest: "Testar Sensor",
      btnProceed: "Diagnóstico Aprovado - Entrar no Deck",
    },
    deck: {
      title: "Deck de Controle Geral",
      subtitle: "Densidade de fluxo ao vivo. O Gemini AI traduz os dados dos sensores e cospe diretivas de ação. Mantenha os olhos abertos.",
      heatmapHeader: "Mapa Térmico do Estádio",
      heatmapLive: "Fluxo de Torcedores ao Vivo",
      directiveHeader: "Diretiva Ativa de IA",
      severityLabel: "NÍVEL DE GRAVIDADE",
      egressHeader: "Caminhos de Esgotamento Recomendados",
      actionHeader: "Plano de Ação de Voluntários",
      xaiHeader: "Cadeia de Raciocínio da IA (XAI)",
      btnAcknowledge: "Confirmar Diretiva",
      announcementHeader: "Scripts de Avisos para Multidão",
      btnCopyScript: "Copiar Texto de Locução",
      targetAudience: "Segmento de Idioma de Torcida",
      simulatorHeader: "Simulador de Anomalias",
      simulatorDesc: "Injete gargalos de fluxo para testar as reações do sistema de inteligência artificial.",
      simSafe: "Resetar: Fluxo Fluido",
      simSurgeC: "Simular: Congestionamento Portão C",
      simSurgeA: "Simular: Checkpoint Bloqueado Portão A",
      btnEndShift: "Finalizar Turno e Sair",
    },
    offramp: {
      title: "Encerramento de Turno Seguro",
      subtitle: "Turno encerrado. Devolva os megafones e powerbanks. Limpe todos os dados locais do estádio de seu celular.",
      purgePrompt: "Arraste o slider para apagar bancos locais, arquivos e cookies do aparelho.",
      equipmentHeader: "Verificação de Equipamento",
      equipmentBarcode: "Código de Barras de Checkout",
      incidentHeader: "Relatório Rápido de Ocorrências",
      incidentDesc: "Relate danos físicos em grades, assentos ou corrimãos encontrados durante o turno.",
      inputPlaceholder: "Digite ocorrências estruturais aqui...",
      btnWipe: "Destruir Dados Locais e Sair",
      wipeSuccess: "Cache zerado. Bom descanso.",
    },
    header: {
      liveFeed: "Ao Vivo",
      gate: "Portão",
      diag: "Diag",
      signOut: "Sair",
      accreditation: "Credenciamento",
      network: "Rede",
      profile: "Perfil",
      layoutTooltip: "Alternar Layout",
      googleLabs: "Google Labs",
      techTeam: "Equipe Técnica FIFA"
    },
    sidebar: {
      missionControl: "Controle da Missão",
      deviceGate: "Portão de Dispositivo",
      authPortal: "Portal de Acesso",
      calibration: "Calibração",
      offRamp: "Saída de Turno",
      semiFinalOps: "Operações da Semifinal"
    },
    mobileMenu: {
      navigation: "Navegação",
      interfaceLanguage: "Idioma da Interface",
      bentoGridView: "Visualização Bento",
      bentoDesc: "Alternar para coluna única compacta",
      gridMode: "Modo Grade",
      listMode: "Modo Lista",
      syncLedgerReady: "Sincronização Offline Ativa",
      online: "ONLINE"
    },
    modals: {
      qrTitle: "Crachá de Credenciamento",
      qrSubtitle: "Escaneie para liberação de segurança",
      qrScanPrompt: "Posicione o código QR na frente da câmera",
      operatorName: "Nome do Operador:",
      securityAccess: "Acesso de Segurança:",
      securityLevel: "Nível 5 (Ops)",
      zoneRange: "Faixa de Zona:",
      netTitle: "Status de Rede do Estádio",
      netSubtitle: "Status de sincronização de telemetria",
      netSpeed: "Velocidade de Conexão:",
      netStable: "Estável",
      ledgerCache: "Cache Offline:",
      ledgerActive: "Ativo (IndexedDB)",
      pipeline: "Pipeline Firestore:",
      pipelineConnected: "CONECTADO (1Hz)",
      unsyncedQueue: "Fila Não Sincronizada:",
      unsyncedOps: "operações pendentes",
      btnPing: "Testar Ping da Rede",
      btnPinging: "Pingando servidor...",
      profileTitle: "Sessão do Operador",
      profileEmail: "steward.ops@fifa.com",
      primaryAssignment: "Designação Principal:",
      currentRole: "Função Atual:",
      roleAnnouncer: "Locutor Voluntário",
      startCoords: "Coordonnées de Service:",
      biometricVerify: "Verificação Biométrica:",
      biometricEnrolled: "CADASTRADO",
      btnReturn: "Voltar para o Painel",
      btnProceedOfframp: "Prosseguir para Sair"
    },
    alerts: {
      cameraUnavailable: "A câmera não está disponível ou a permissão foi negada. O PIN alternativo de Zero-Trust está ativo.",
      reportTooLong: "Os detalhes do relatório excedem o comprimento máximo de 1000 caracteres.",
      reportSuccess: "Relatório registrado com sucesso no banco de dados central de ativos.",
      reportFailed: "Falha ao enviar o relatório. Verifique a conexão e tente novamente.",
      copiedScript: "Script do locutor copiado!",
      enrollingWebauthn: "Simulando vinculação de chave WebAuthn... Concluído.",
      simulatingFaceid: "Simulando assinatura FaceID... Verificado.",
      copyScriptTitle: "Copiar script",
      gateA: "Portão A",
      gateB: "Portão B",
      gateC: "Portão C",
      gateD: "Portão D",
      gatesAE: "Portões A-E",
      activeSteward: "Steward Ativo"
    }
  },
  ar: {
    common: {
      networkStable: "الشبكة مستقرة",
      emergencyBroadcast: "بث طوارئ عاجل",
      status: "بيانات الاستشعار",
      settings: "الإعدادات",
    },
    mission: {
      preShiftTag: "يوم المباراة -1 / التحضير النهائي",
      welcomeTitle: "مرحبًا بعودتك، أيها المشغّل.",
      welcomeDesc: "جميع الأنظمة تعمل بكفاءة. موقع عملك التالي في القطاع 7G. راجع قوائم التحقق الضرورية قبل بدء الوردية.",
      startShift: "بدء الوردية",
      checklistHeader: "قوائم التحقق الميدانية",
      checklistLocations: "موقعان",
      attStadium: "ملعب AT&T",
      attSector: "القطاع 3، أرلينغتون",
      attReady: "جاهز",
      mbStadium: "مرسيدس-بنز",
      mbZone: "المنطقة C، أتلانتا",
      mbPending: "قيد الانتظار",
      timelineHeader: "الجدول الزمني ليوم المباراة",
      timelineBriefing: "إحاطة المقر الرئيسي",
      timelineDeploy: "الانتشار في القطاعات",
      timelineGatesOpen: "فتح البوابات",
      timelineActive: "نشط",
      transitRoutesHeader: "خريطة مسارات النقل",
      taskCollectLanyard: "استلام بطاقة الاعتماد المعلقة",
      taskVerifyComms: "التحقق من قناة الاتصال Alpha",
      taskInspectBarriers: "فحص حواجز السيطرة على الحشود عند البوابة A",
      taskSyncBiometric: "مزامنة جهاز المسح البيومتري",
      taskSecurityClearance: "في انتظار رمز التصريح الأمني",
      taskCalibrateDetectors: "معايرة أجهزة كشف المعادن",
      taskReviewVipRoster: "مراجعة قائمة دخول كبار الشخصيات",
    },
    provision: {
      title: "بوابة إعداد وتجهيز الجهاز",
      subtitle: "شبكة الاتصالات الخلوية في الاستاد مزدحمة للغاية. نقوم بإجبار المتصفح على حفظ الخرائط وملفات الترجمة محليًا لضمان عمل التطبيق في المناطق الخالية من التغطية.",
      osCheck: "فحص توافق نظام التشغيل",
      cameraCheck: "صلاحية الكاميرا لمسح رمز QR",
      securityToken: "محاكاة مفتاح WebAuthn للأمان",
      btnSync: "بدء مزامنة البيانات والعمل بدون اتصال",
      syncing: "جاري تحميل الموارد المحلية...",
      done: "تم تحميل ملفات المزامنة المحلية بنجاح",
      pwaStatus: "جاري تثبيت الخلفية البرمجية...",
      pwaDone: "تم تسجيل تطبيق PWA بنجاح.",
    },
    auth: {
      title: "بوابة الهوية الأمنية المشددة",
      subtitle: "كلمات المرور التقليدية عديمة الفائدة في بيئات الملاعب المزدحمة. سجل دخولك فورًا بمسح رمز QR لبطاقتك الرسمية أو البصمة البيومترية.",
      scanPrompt: "ضع رمز QR لبطاقة الاعتماد الخاصة بك أمام الكاميرا مباشرة",
      faceId: "مسح بصمة الوجه",
      touchId: "مسح بصمة الإصبع",
      orPin: "أو أدخل الرمز السري المكون من 6 أرقام",
      pinDisplay: "الرمز السري الآمن للاعتماد",
      helpBtn: "البطاقة تالفة؟ احصل على تجاوز من المشرف.",
      btnVerify: "التحقق من رمز PIN",
    },
    calibrate: {
      title: "معايرة إحداثيات الاستاد",
      subtitle: "نعم، أنت معين في القطاع 7G. لا، لا يمكننا نقلك للمقصورة الرئيسية. قم بمعايرة حساسات جهازك وتشغيل فحوصات التوافق للمتابعة.",
      locationTarget: "موقع العمليات الخاص بك",
      tier: "المستوى المدرجي للاستاد",
      sector: "معرف القطاع المعين",
      placeholderSector: "مثال: ALPHA-NORTH",
      supervisorHeader: "رمز التحقق الخاص بالمشرف",
      supervisorSubtitle: "اعرض هذا الرمز المتغير على المشرف لتفعيل الحساب على الهواء",
      diagnosticsHeader: "فحوصات سلامة أجهزة الهاتف",
      diagnosticsSubtitle: "تحقق من عمل مكبر الصوت وموتور الاهتزاز وجهاز تحديد المواقع قبل الدخول",
      testSiren: "اختبار صفارة الإنذار الصوتي",
      testVibe: "اختبار محرك الاهتزاز اللمسي",
      testMic: "محلل ضوضاء الحشود (الميكروفون)",
      testGps: "دقة إحداثيات GPS (< 5 أمتار)",
      btnTest: "اختبار جزء الحساس",
      btnProceed: "اكتملت الفحوصات بنجاح - إطلاق العمليات",
    },
    deck: {
      title: "منصة التحكم الموحدة",
      subtitle: "مستويات الحشود محدثة مباشرة. يقوم نظام Gemini AI بتحليل قراءات أجهزة الاستشعار لإصدار تعليمات العمل المباشرة. انتبه جيدًا.",
      heatmapHeader: "الخريطة الحرارية للاستاد",
      heatmapLive: "طبقة تدفق الحشود الحية",
      directiveHeader: "تعليمات الذكاء الاصطناعي النشطة",
      severityLabel: "مستوى الخطورة",
      egressHeader: "مسارات الإخلاء المقترحة",
      actionHeader: "خطة عمل مرشد الحشود",
      xaiHeader: "سلسلة تحليل الذكاء الاصطناعي التفسيري (XAI)",
      btnAcknowledge: "تأكيد وقبول التعليمات",
      announcementHeader: "نصوص الإعلان متعددة اللغات للحشود",
      btnCopyScript: "نسخ نص الإعلان",
      targetAudience: "اللغة الرئيسية للمشجعين المستهدفين",
      simulatorHeader: "لوحة محاكاة الحوادث",
      simulatorDesc: "قم بحقن حالات اختناق افتراضية لاختبار استجابة الذكاء الاصطناعي الذكية.",
      simSafe: "إعادة ضبط: تدفق حشود مثالي",
      simSurgeC: "محاكاة: تكدس عند البوابة C",
      simSurgeA: "محاكاة: انسداد البوابة A الرئيسية",
      btnEndShift: "إنهاء الوردية وبدء الخروج الآمن",
    },
    offramp: {
      title: "الخروج الآمن وتفريغ البيانات",
      subtitle: "اكتملت ورديتك. أعد مكبرات الصوت والبطاريات الاحتياطية. امسح كافة بيانات العمل والتسجيلات المحلية قبل المغادرة.",
      purgePrompt: "اسحب الشريط لتدمير كافة قواعد البيانات، والملفات المؤقتة، وملفات الكوكيز من الجهاز.",
      equipmentHeader: "بروتوكول تسليم العتاد والأجهزة",
      equipmentBarcode: "رمز الخروج للمسح الضوئي",
      incidentHeader: "تقرير الحوادث في نهاية الوردية",
      incidentDesc: "سجل باختصار أي مشاكل هيكلية أو أعطال في الحواجز والدرابزينات واجهتك اليوم.",
      inputPlaceholder: "أدخل تقرير الأعطال الهيكلية هنا...",
      btnWipe: "مسح البيانات المحلية وتسجيل الخروج الآمن",
      wipeSuccess: "تم تفريغ الذاكرة المؤقتة بالكامل. رحلة سعيدة.",
    },
    header: {
      liveFeed: "البث الحي",
      gate: "البوابة",
      signOut: "تسجيل الخروج",
      diag: "الفحص",
      accreditation: "الاعتماد",
      network: "الشبكة",
      profile: "الملف الشخصي",
      layoutTooltip: "تبديل المظهر",
      googleLabs: "مختبرات جوجل",
      techTeam: "الفريق التقني لـ FIFA"
    },
    sidebar: {
      missionControl: "منصة التحكم",
      deviceGate: "بوابة الجهاز",
      authPortal: "بوابة الهوية",
      calibration: "المعايرة",
      offRamp: "إنهاء الوردية",
      semiFinalOps: "عمليات نصف النهائي"
    },
    mobileMenu: {
      navigation: "التنقل",
      interfaceLanguage: "لغة الواجهة",
      bentoGridView: "عرض بنتو جرد",
      bentoDesc: "تبديل العرض إلى عمود واحد مدمج",
      gridMode: "وضع الشبكة",
      listMode: "وضع القائمة",
      syncLedgerReady: "دفتر التزامن غير المتصل جاهز",
      online: "متصل"
    },
    modals: {
      qrTitle: "بطاقة الاعتماد",
      qrSubtitle: "امسح للتصريح الأمني عند نقطة التفتيش",
      qrScanPrompt: "ضع رمز QR للاعتماد أمام الكاميرا",
      operatorName: "اسم المشغل:",
      securityAccess: "صلاحية الوصول:",
      securityLevel: "المستوى 5 (العمليات)",
      zoneRange: "نطاق المنطقة:",
      netTitle: "حالة شبكة الاستاد",
      netSubtitle: "حالة مزامنة بيانات الاستشعار الحية",
      netSpeed: "سرعة الاتصال:",
      netStable: "مستقر",
      ledgerCache: "ذاكرة التخزين غير المتصلة:",
      ledgerActive: "نشط (IndexedDB)",
      pipeline: "قناة فايرستور:",
      pipelineConnected: "متصل (1 هرتز)",
      unsyncedQueue: "قائمة الانتظار غير المتزامنة:",
      unsyncedOps: "عمليات معلقة",
      btnPing: "إجراء اختبار اتصال الشبكة",
      btnPinging: "جاري اختبار الاتصال...",
      profileTitle: "جلسة المشغل",
      profileEmail: "steward.ops@fifa.com",
      primaryAssignment: "الموقع الرئيسي:",
      currentRole: "الدور الحالي:",
      roleAnnouncer: "مذيع متطوع",
      startCoords: "إحداثيات بدء الوردية:",
      biometricVerify: "التحقق البيومتري:",
      biometricEnrolled: "مسجل",
      btnReturn: "العودة إلى لوحة التحكم",
      btnProceedOfframp: "المتابعة لتسجيل الخروج"
    },
    alerts: {
      cameraUnavailable: "ميزة الكاميرا غير متوفرة أو تم رفض الإذن. وضع PIN البديل نشط.",
      reportTooLong: "تتجاوز تفاصيل التقرير الحد الأقصى المسموح به وهو 1000 حرف.",
      reportSuccess: "تم تسجيل التقرير بنجاح في قاعدة بيانات الأصول المركزية.",
      reportFailed: "فشل إرسال التقرير. يرجى التحقق من الاتصال وإعادة المحاولة.",
      copiedScript: "تم نسخ نص الإعلان!",
      enrollingWebauthn: "محاكاة ربط مفتاح WebAuthn... تم بنجاح.",
      simulatingFaceid: "محاكاة بصمة الوجه... تم التحقق.",
      copyScriptTitle: "نسخ النص",
      gateA: "البوابة A",
      gateB: "البوابة B",
      gateC: "البوابة C",
      gateD: "البوابة D",
      gatesAE: "البوابات A-E",
      activeSteward: "مشرف نشط"
    }
  },
  zh: {
    common: {
      networkStable: "网络连接正常",
      emergencyBroadcast: "紧急广播控制",
      status: "系统状态",
      settings: "系统设置",
    },
    mission: {
      preShiftTag: "比赛日 -1 / 最终准备",
      welcomeTitle: "欢迎回来，运营员。",
      welcomeDesc: "所有系统运行正常。您的下一个岗位安排在 7G 分区。请在开始值班前查看以下关键检查清单。",
      startShift: "开始值班",
      checklistHeader: "部署检查清单",
      checklistLocations: "2 个场馆",
      attStadium: "AT&T 体育场",
      attSector: "第3分区，阿灵顿",
      attReady: "就绪",
      mbStadium: "梅赛德斯-奔驰",
      mbZone: "C区，亚特兰大",
      mbPending: "待定",
      timelineHeader: "比赛日时间线",
      timelineBriefing: "总部简报",
      timelineDeploy: "分派至各分区",
      timelineGatesOpen: "开门入场",
      timelineActive: "进行中",
      transitRoutesHeader: "交通路线地图",
      taskCollectLanyard: "领取工作证挂绳",
      taskVerifyComms: "验证 Alpha 通讯频道",
      taskInspectBarriers: "检查 A 入口人群管控围栏",
      taskSyncBiometric: "同步生物识别扫描仪",
      taskSecurityClearance: "等待安全放行码",
      taskCalibrateDetectors: "校准金属探测器",
      taskReviewVipRoster: "审核VIP通行名单",
    },
    provision: {
      title: "设备预配置网关",
      subtitle: "体育场内移动信号严重拥堵。我们将所有地图、本地资源及翻译包强制缓存在浏览器本地，以确保在信号死区也能正常工作。",
      osCheck: "操作系统版本验证",
      cameraCheck: "扫码相机访问权限",
      securityToken: "WebAuthn 密钥校验模拟",
      btnSync: "强制下载地图及离线包",
      syncing: "正在缓存本地资源...",
      done: "离线包完全载入成功",
      pwaStatus: "正在安装后台服务进程...",
      pwaDone: "PWA离线注册成功。",
    },
    auth: {
      title: "零信任身份验证网关",
      subtitle: "在九万人喧嚣的体育场中，传统密码毫无用处。请扫描您的工作证QR码或使用绑定的生物识别直接登录。",
      scanPrompt: "请将您的官方工作证QR码对准手机摄像头",
      faceId: "面容识别登录",
      touchId: "指纹识别登录",
      orPin: "或者输入6位工作证安全PIN码",
      pinDisplay: "工作证件安全代码",
      helpBtn: "证件损坏或无法扫描？获取管理员协助。",
      btnVerify: "验证 PIN 码",
    },
    calibrate: {
      title: "体育场坐标校准",
      subtitle: "是的，你被分配到了 7G 分区。不，我们无法把你调去VIP贵宾席。在进入系统前，请先校准你的位置并运行传感器检测。",
      locationTarget: "您的运营岗位坐标",
      tier: "体育场看台层级",
      sector: "分区编号代码",
      placeholderSector: "例如：ALPHA-NORTH",
      supervisorHeader: "主管确认 pin 码",
      supervisorSubtitle: "将此不断刷新的验证码出示给现场主管以激活运营权限",
      diagnosticsHeader: "手机硬件诊断检测",
      diagnosticsSubtitle: "在接管现场之前，请确保手机的振动、麦克风和定位传感器确实正常工作",
      testSiren: "声音警报回路测试",
      testVibe: "振动触觉反馈测试",
      testMic: "麦克风环境噪音测试",
      testGps: "GPS 坐标精度校验 (< 5米)",
      btnTest: "检测硬件组件",
      btnProceed: "诊断全部合格 - 开启控制面板",
    },
    deck: {
      title: "综合运营控制甲板",
      subtitle: "现场人流数据已实时同步。Gemini AI 正在分析传感器回传，发布行动指令。请保持高度警觉。",
      heatmapHeader: "场馆传感器热力图",
      heatmapLive: "实时人流方向覆盖图",
      directiveHeader: "当前 AI 调配指令",
      severityLabel: "紧急程度级别",
      egressHeader: "推荐疏散分流路径",
      actionHeader: "志愿者岗位执行步骤",
      xaiHeader: "可解释 AI (XAI) 决策链条",
      btnAcknowledge: "确认并执行此指令",
      announcementHeader: "多语言现场引导广播脚本",
      btnCopyScript: "复制当前广播脚本",
      targetAudience: "目标球迷受众语言段",
      simulatorHeader: "模拟演练控制中心",
      simulatorDesc: "手动注入模拟人流拥堵，测试 AI 智能决策引擎的实时反应。",
      simSafe: "重置：最优流通状态",
      simSurgeC: "模拟：C出口突发客流拥堵",
      simSurgeA: "模拟：A入口安检通道受阻",
      btnEndShift: "启动下班清退程序",
    },
    offramp: {
      title: "安全签退与下班清退",
      subtitle: "值班已结束。请勿私自带走扩音器、充电宝等设备。离开前请务必擦除本手机中的所有现场运营日志和地图缓存。",
      purgePrompt: "向右滑动下方滑块，强制抹除本地所有数据库、离线文件及身份Cookie。",
      equipmentHeader: "设备返还登记协议",
      equipmentBarcode: "工卡签退条形码",
      incidentHeader: "值班期间设施故障汇报",
      incidentDesc: "简要记录您今天发现的任何设施损坏（例如：护栏松动、扶手折断等）。",
      inputPlaceholder: "在此输入发现的设施故障或笔记...",
      btnWipe: "擦除数据并安全签退",
      wipeSuccess: "缓存清理完毕。下班愉快，一路平安。",
    },
    header: {
      liveFeed: "实时数据",
      gate: "通道控制",
      signOut: "签退",
      diag: "诊断",
      accreditation: "工作证件",
      network: "网络状态",
      profile: "个人信息",
      layoutTooltip: "切换视图布局",
      googleLabs: "谷歌实验室",
      techTeam: "FIFA 技术团队"
    },
    sidebar: {
      missionControl: "运营控制",
      deviceGate: "设备配置",
      authPortal: "身份验证",
      calibration: "基准校准",
      offRamp: "安全下班",
      semiFinalOps: "半决赛现场运营"
    },
    mobileMenu: {
      navigation: "导航菜单",
      interfaceLanguage: "界面语言",
      bentoGridView: "网格视图",
      bentoDesc: "切换至紧凑单列堆叠布局",
      gridMode: "网格模式",
      listMode: "列表模式",
      syncLedgerReady: "离线同步账本已就绪",
      online: "在线"
    },
    modals: {
      qrTitle: "官方工作证件",
      qrSubtitle: "扫描以通过终端安全检查点",
      qrScanPrompt: "请将您的官方工作证QR码对准摄像头",
      operatorName: "操作员姓名:",
      securityAccess: "安全访问级别:",
      securityLevel: "5 级 (现场运营)",
      zoneRange: "区域范围:",
      netTitle: "场馆网络状态",
      netSubtitle: "实时传感器同步管道状态",
      netSpeed: "网络连接速度:",
      netStable: "稳定",
      ledgerCache: "离线存储缓存:",
      ledgerActive: "已激活 (IndexedDB)",
      pipeline: "Firestore 管道:",
      pipelineConnected: "已连接 (1Hz)",
      unsyncedQueue: "未同步写入队列:",
      unsyncedOps: "个挂起的操作",
      btnPing: "运行网络延迟测试",
      btnPinging: "正在测试网络连接...",
      profileTitle: "操作员会话",
      profileEmail: "steward.ops@fifa.com",
      primaryAssignment: "首要派驻岗位:",
      currentRole: "当前值班角色:",
      roleAnnouncer: "志愿现场播音员",
      startCoords: "接管岗位经纬度:",
      biometricVerify: "指纹/面容状态:",
      biometricEnrolled: "已启用安全验证",
      btnReturn: "返回控制甲板",
      btnProceedOfframp: "进入安全签退流程"
    },
    alerts: {
      cameraUnavailable: "摄像头功能不可用或权限被拒绝。零安全Pin码回退已激活。",
      reportTooLong: "报告详细内容超过1000字符最大长度限制。",
      reportSuccess: "报告成功记录至中心资产数据库。",
      reportFailed: "提交报告失败。请检查网络连接并重试。",
      copiedScript: "广播脚本已成功复制！",
      enrollingWebauthn: "正在模拟 WebAuthn 凭证绑定... 绑定成功。",
      simulatingFaceid: "正在模拟 FaceID 签名... 验证通过。",
      copyScriptTitle: "复制广播脚本",
      gateA: "A出口",
      gateB: "B出口",
      gateC: "C出口",
      gateD: "D出口",
      gatesAE: "A-E出口",
      activeSteward: "在岗操作员"
    }
  },
};
