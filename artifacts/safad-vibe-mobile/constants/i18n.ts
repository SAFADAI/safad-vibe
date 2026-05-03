export type LanguageCode =
  | "en" | "ar" | "fr" | "es" | "de" | "it" | "pt" | "ru"
  | "zh" | "ja" | "ko" | "tr" | "nl" | "pl" | "sv" | "fa"
  | "ur" | "hi" | "id" | "no";

export const RTL_LANGUAGES: LanguageCode[] = ["ar", "fa", "ur"];

export interface LangMeta {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LangMeta[] = [
  { code: "en", name: "English",    nativeName: "English",    flag: "🇬🇧" },
  { code: "ar", name: "Arabic",     nativeName: "العربية",    flag: "🇸🇦" },
  { code: "fr", name: "French",     nativeName: "Français",   flag: "🇫🇷" },
  { code: "es", name: "Spanish",    nativeName: "Español",    flag: "🇪🇸" },
  { code: "de", name: "German",     nativeName: "Deutsch",    flag: "🇩🇪" },
  { code: "it", name: "Italian",    nativeName: "Italiano",   flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português",  flag: "🇧🇷" },
  { code: "ru", name: "Russian",    nativeName: "Русский",    flag: "🇷🇺" },
  { code: "zh", name: "Chinese",    nativeName: "中文",        flag: "🇨🇳" },
  { code: "ja", name: "Japanese",   nativeName: "日本語",      flag: "🇯🇵" },
  { code: "ko", name: "Korean",     nativeName: "한국어",      flag: "🇰🇷" },
  { code: "tr", name: "Turkish",    nativeName: "Türkçe",     flag: "🇹🇷" },
  { code: "nl", name: "Dutch",      nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polish",     nativeName: "Polski",     flag: "🇵🇱" },
  { code: "sv", name: "Swedish",    nativeName: "Svenska",    flag: "🇸🇪" },
  { code: "fa", name: "Persian",    nativeName: "فارسی",      flag: "🇮🇷" },
  { code: "ur", name: "Urdu",       nativeName: "اردو",       flag: "🇵🇰" },
  { code: "hi", name: "Hindi",      nativeName: "हिन्दी",     flag: "🇮🇳" },
  { code: "id", name: "Indonesian", nativeName: "Indonesia",  flag: "🇮🇩" },
  { code: "no", name: "Norwegian",  nativeName: "Norsk",      flag: "🇳🇴" },
];

export interface Translations {
  tabs: { home: string; products: string; flights: string; hotels: string };
  priceHistory: {
    title: string; chart: string; days: string; allPlatforms: string;
    loading: string; current: string; lowest: string; highest: string;
    savings: string; fromPeak: string; greatTime: string; waitTime: string; avgTime: string;
  };
  priceAlert: {
    title: string; setAlert: string; targetPrice: string; currentPrice: string;
    setBtn: string; deleteBtn: string; triggered: string; activeTitle: string;
    triggeredTitle: string; alertWhen: string; nowBelow: string; howItWorks: string;
    savingsOf: string; alreadyBelow: string; quickTargets: string; invalidPrice: string;
    badge: string;
  };
  myAlerts: {
    title: string; triggered: string; tabAll: string; tabTriggered: string; tabActive: string;
    noAlerts: string; noAlertsMsg: string; browseProducts: string; editAlert: string;
    saveBtn: string; confirmDelete: string; confirmDeleteMsg: string;
    clearTriggered: string; clearTriggeredMsg: string; clearBtn: string; tapToEdit: string;
  };
  localStores: { title: string; open: string; disclaimer: string; };
  camera: {
    title: string; selectSource: string; takePhoto: string;
    chooseGallery: string; cancel: string; analyzing: string;
    detected: string; confidence: string; searchWith: string;
    noResult: string; permissionDenied: string;
  };
  home: {
    title: string; subtitle: string; searchPlaceholder: string;
    recentSearches: string; trendingProducts: string; popularFlights: string;
    hotelDestinations: string; seeAll: string;
  };
  products: {
    title: string; searchPlaceholder: string; noResults: string;
    noTrending: string; checkBack: string; tryDifferent: string;
    searching: string; loadingTrending: string;
  };
  flights: {
    title: string; from: string; to: string; date: string;
    passengers: string; searchBtn: string; noResults: string;
    tryDifferent: string; popularRoutes: string; direct: string;
    stop: string; stops: string; baggageIncluded: string; book: string;
    from: string; searchingFlights: string;
  };
  hotels: {
    title: string; destination: string; checkin: string; checkout: string;
    searchBtn: string; noResults: string; tryDifferent: string;
    popularDestinations: string; perNight: string; book: string;
    findingHotels: string;
  };
  cabin: { economy: string; premium: string; business: string; first: string };
  sort: { bestMatch: string; priceAsc: string; priceDesc: string; fastest: string; price: string; rating: string; distance: string };
  region: { global: string; us: string; eu: string; arab: string; asia: string };
  language: { title: string; select: string };
}

const t: Record<LanguageCode, Translations> = {
  en: {
    tabs: { home: "Home", products: "Products", flights: "Flights", hotels: "Hotels" },
    priceHistory: { title: "Price History", chart: "Price History", days: "d", allPlatforms: "All", loading: "Loading price history...", current: "Current", lowest: "Lowest", highest: "Highest", savings: "You could save", fromPeak: "from peak price", greatTime: "Great time to buy — price is near its lowest!", waitTime: "Price is near its peak, consider waiting.", avgTime: "Price is in the average range." },
    priceAlert: { title: "Price Alert", setAlert: "Set Alert", targetPrice: "Target Price", currentPrice: "Current Price", setBtn: "Set Price Alert", deleteBtn: "Remove Alert", triggered: "Price Dropped!", activeTitle: "Alert Active", triggeredTitle: "Price Dropped! 🎉", alertWhen: "Alert when below", nowBelow: "Current price is now at or below your target!", howItWorks: "We'll mark this alert when the price reaches your target.", savingsOf: "You'll save", alreadyBelow: "Target is above current price — alert will trigger immediately", quickTargets: "Quick targets", invalidPrice: "Please enter a valid price", badge: "price alerts" },
    myAlerts: { title: "My Alerts", triggered: "triggered", tabAll: "All", tabTriggered: "Triggered", tabActive: "Active", noAlerts: "No alerts yet", noAlertsMsg: "Set alerts on product cards to get notified when prices drop.", browseProducts: "Browse Products", editAlert: "Edit Alert", saveBtn: "Save Changes", confirmDelete: "Remove alert?", confirmDeleteMsg: "This alert will be permanently removed.", clearTriggered: "Clear triggered alerts?", clearTriggeredMsg: "All triggered alerts will be removed.", clearBtn: "Clear all", tapToEdit: "Tap to edit target price" },
    localStores: { title: "Local Stores", open: "Open", disclaimer: "Tap a store to search on their website" },
    camera: { title: "Image Search", selectSource: "Search by Image", takePhoto: "Take Photo", chooseGallery: "Choose from Gallery", cancel: "Cancel", analyzing: "Analyzing image...", detected: "Detected", confidence: "Confidence", searchWith: "Search with this", noResult: "Could not identify product", permissionDenied: "Camera access denied" },
    home: { title: "Safad Vibe", subtitle: "Search products, flights & hotels", searchPlaceholder: "Search anything...", recentSearches: "Recent Searches", trendingProducts: "Trending Products", popularFlights: "Popular Flights", hotelDestinations: "Hotel Destinations", seeAll: "See all" },
    products: { title: "Products", searchPlaceholder: "Search products...", noResults: "No products found", noTrending: "No trending products", checkBack: "Check back later", tryDifferent: "Try a different search term", searching: "Searching...", loadingTrending: "Loading trending..." },
    flights: { title: "Flights", from: "From (IATA)", to: "To (IATA)", date: "Date (YYYY-MM-DD)", passengers: "Passengers", searchBtn: "Search Flights", noResults: "No flights found", tryDifferent: "Try different dates or destinations", popularRoutes: "Popular Routes", direct: "Direct", stop: "stop", stops: "stops", baggageIncluded: "Baggage included", book: "Book", from: "from", searchingFlights: "Searching flights..." },
    hotels: { title: "Hotels", destination: "Destination (city or hotel)", checkin: "Check-in", checkout: "Check-out", searchBtn: "Search Hotels", noResults: "No hotels found", tryDifferent: "Try different dates or destination", popularDestinations: "Popular Destinations", perNight: "per night", book: "Book", findingHotels: "Finding hotels..." },
    cabin: { economy: "Economy", premium: "Premium", business: "Business", first: "First" },
    sort: { bestMatch: "Best Match", priceAsc: "Price ↑", priceDesc: "Price ↓", fastest: "Fastest", price: "Price", rating: "Rating", distance: "Distance" },
    region: { global: "GLOBAL", us: "US", eu: "EU", arab: "ARAB", asia: "ASIA" },
    language: { title: "Language", select: "Select Language" },
  },
  ar: {
    tabs: { home: "الرئيسية", products: "المنتجات", flights: "الرحلات", hotels: "الفنادق" },
    priceHistory: { title: "تاريخ الأسعار", chart: "تاريخ السعر", days: "ي", allPlatforms: "الكل", loading: "جارٍ تحميل تاريخ الأسعار...", current: "الحالي", lowest: "الأدنى", highest: "الأعلى", savings: "يمكنك توفير", fromPeak: "من الذروة", greatTime: "وقت رائع للشراء — السعر قريب من أدنى مستوياته!", waitTime: "السعر قريب من ذروته، فكر في الانتظار.", avgTime: "السعر في النطاق المتوسط." },
    priceAlert: { title: "تنبيه السعر", setAlert: "تعيين تنبيه", targetPrice: "السعر المستهدف", currentPrice: "السعر الحالي", setBtn: "تعيين تنبيه السعر", deleteBtn: "حذف التنبيه", triggered: "انخفض السعر!", activeTitle: "التنبيه نشط", triggeredTitle: "انخفض السعر! 🎉", alertWhen: "أنبهني عندما ينخفض إلى", nowBelow: "السعر الحالي وصل إلى هدفك أو أقل!", howItWorks: "سنُنبهك عندما يصل السعر إلى هدفك.", savingsOf: "ستوفر", alreadyBelow: "الهدف أعلى من السعر الحالي — سيُفعَّل التنبيه فوراً", quickTargets: "أهداف سريعة", invalidPrice: "أدخل سعراً صحيحاً", badge: "تنبيهات أسعار" },
    myAlerts: { title: "تنبيهاتي", triggered: "مفعّل", tabAll: "الكل", tabTriggered: "المفعّلة", tabActive: "النشطة", noAlerts: "لا تنبيهات بعد", noAlertsMsg: "عيّن تنبيهات على بطاقات المنتجات لتُعلَم عند انخفاض الأسعار.", browseProducts: "تصفح المنتجات", editAlert: "تعديل التنبيه", saveBtn: "حفظ التغييرات", confirmDelete: "حذف التنبيه؟", confirmDeleteMsg: "سيُحذف هذا التنبيه بشكل دائم.", clearTriggered: "حذف التنبيهات المفعّلة؟", clearTriggeredMsg: "ستُحذف جميع التنبيهات المفعّلة.", clearBtn: "حذف الكل", tapToEdit: "اضغط لتعديل السعر المستهدف" },
    localStores: { title: "المتاجر المحلية", open: "فتح", disclaimer: "اضغط على متجر للبحث في موقعه" },
    camera: { title: "البحث بالصورة", selectSource: "ابحث بصورة", takePhoto: "التقاط صورة", chooseGallery: "اختر من المعرض", cancel: "إلغاء", analyzing: "جارٍ تحليل الصورة...", detected: "تم الكشف", confidence: "الثقة", searchWith: "ابحث بهذا", noResult: "تعذر التعرف على المنتج", permissionDenied: "تم رفض الوصول إلى الكاميرا" },
    home: { title: "صفد فايب", subtitle: "ابحث عن منتجات، رحلات وفنادق", searchPlaceholder: "ابحث عن أي شيء...", recentSearches: "عمليات البحث الأخيرة", trendingProducts: "المنتجات الرائجة", popularFlights: "الرحلات الشائعة", hotelDestinations: "وجهات الفنادق", seeAll: "عرض الكل" },
    products: { title: "المنتجات", searchPlaceholder: "ابحث عن منتجات...", noResults: "لم يتم العثور على منتجات", noTrending: "لا توجد منتجات رائجة", checkBack: "تفقد لاحقاً", tryDifferent: "جرب مصطلح بحث مختلف", searching: "جارٍ البحث...", loadingTrending: "تحميل الرائج..." },
    flights: { title: "الرحلات", from: "من (IATA)", to: "إلى (IATA)", date: "التاريخ (YYYY-MM-DD)", passengers: "المسافرون", searchBtn: "بحث عن رحلات", noResults: "لم يتم العثور على رحلات", tryDifferent: "جرب تواريخ أو وجهات مختلفة", popularRoutes: "المسارات الشائعة", direct: "مباشر", stop: "توقف", stops: "توقفات", baggageIncluded: "الأمتعة مشمولة", book: "احجز", from: "من", searchingFlights: "جارٍ البحث عن رحلات..." },
    hotels: { title: "الفنادق", destination: "الوجهة (مدينة أو فندق)", checkin: "تسجيل الوصول", checkout: "تسجيل المغادرة", searchBtn: "بحث عن فنادق", noResults: "لم يتم العثور على فنادق", tryDifferent: "جرب تواريخ أو وجهة مختلفة", popularDestinations: "الوجهات الشائعة", perNight: "في الليلة", book: "احجز", findingHotels: "جارٍ البحث عن فنادق..." },
    cabin: { economy: "اقتصادي", premium: "بريميوم", business: "أعمال", first: "الدرجة الأولى" },
    sort: { bestMatch: "الأنسب", priceAsc: "السعر ↑", priceDesc: "السعر ↓", fastest: "الأسرع", price: "السعر", rating: "التقييم", distance: "المسافة" },
    region: { global: "عالمي", us: "أمريكا", eu: "أوروبا", arab: "عربي", asia: "آسيا" },
    language: { title: "اللغة", select: "اختر اللغة" },
  },
  fr: {
    tabs: { home: "Accueil", products: "Produits", flights: "Vols", hotels: "Hôtels" },
    priceHistory: { title: "Historique des prix", chart: "Historique", days: "j", allPlatforms: "Tous", loading: "Chargement...", current: "Actuel", lowest: "Minimum", highest: "Maximum", savings: "Économisez", fromPeak: "par rapport au pic", greatTime: "Bon moment pour acheter — prix proche du minimum!", waitTime: "Prix proche du pic, attendez peut-être.", avgTime: "Prix dans la moyenne." },
    priceAlert: { title: "Alerte de prix", setAlert: "Créer alerte", targetPrice: "Prix cible", currentPrice: "Prix actuel", setBtn: "Créer une alerte de prix", deleteBtn: "Supprimer l'alerte", triggered: "Prix baissé!", activeTitle: "Alerte active", triggeredTitle: "Prix baissé! 🎉", alertWhen: "Alerte si en dessous de", nowBelow: "Le prix actuel est à votre objectif ou en dessous!", howItWorks: "Nous marquerons cette alerte quand le prix atteindra votre objectif.", savingsOf: "Vous économiserez", alreadyBelow: "L'objectif est au-dessus du prix actuel — l'alerte se déclenchera immédiatement", quickTargets: "Objectifs rapides", invalidPrice: "Veuillez entrer un prix valide", badge: "alertes de prix" },
    myAlerts: { title: "Mes alertes", triggered: "déclenchée", tabAll: "Tout", tabTriggered: "Déclenchées", tabActive: "Actives", noAlerts: "Pas encore d'alertes", noAlertsMsg: "Définissez des alertes sur les fiches produit pour être notifié des baisses de prix.", browseProducts: "Parcourir les produits", editAlert: "Modifier l'alerte", saveBtn: "Enregistrer", confirmDelete: "Supprimer l'alerte ?", confirmDeleteMsg: "Cette alerte sera définitivement supprimée.", clearTriggered: "Effacer les alertes déclenchées ?", clearTriggeredMsg: "Toutes les alertes déclenchées seront supprimées.", clearBtn: "Tout effacer", tapToEdit: "Appuyez pour modifier le prix cible" },
    localStores: { title: "Magasins locaux", open: "Ouvrir", disclaimer: "Appuyez pour chercher sur leur site" },
    camera: { title: "Recherche par image", selectSource: "Rechercher par image", takePhoto: "Prendre une photo", chooseGallery: "Choisir dans la galerie", cancel: "Annuler", analyzing: "Analyse en cours...", detected: "Détecté", confidence: "Confiance", searchWith: "Rechercher avec ceci", noResult: "Produit non identifié", permissionDenied: "Accès caméra refusé" },
    home: { title: "Safad Vibe", subtitle: "Recherchez produits, vols & hôtels", searchPlaceholder: "Rechercher...", recentSearches: "Recherches récentes", trendingProducts: "Produits tendance", popularFlights: "Vols populaires", hotelDestinations: "Destinations hôtels", seeAll: "Voir tout" },
    products: { title: "Produits", searchPlaceholder: "Rechercher des produits...", noResults: "Aucun produit trouvé", noTrending: "Pas de produits tendance", checkBack: "Revenez plus tard", tryDifferent: "Essayez un autre terme", searching: "Recherche...", loadingTrending: "Chargement..." },
    flights: { title: "Vols", from: "De (IATA)", to: "À (IATA)", date: "Date (AAAA-MM-JJ)", passengers: "Passagers", searchBtn: "Rechercher des vols", noResults: "Aucun vol trouvé", tryDifferent: "Essayez d'autres dates ou destinations", popularRoutes: "Itinéraires populaires", direct: "Direct", stop: "escale", stops: "escales", baggageIncluded: "Bagages inclus", book: "Réserver", from: "à partir de", searchingFlights: "Recherche de vols..." },
    hotels: { title: "Hôtels", destination: "Destination (ville ou hôtel)", checkin: "Arrivée", checkout: "Départ", searchBtn: "Rechercher des hôtels", noResults: "Aucun hôtel trouvé", tryDifferent: "Essayez d'autres dates ou destination", popularDestinations: "Destinations populaires", perNight: "par nuit", book: "Réserver", findingHotels: "Recherche d'hôtels..." },
    cabin: { economy: "Économique", premium: "Premium", business: "Affaires", first: "Première" },
    sort: { bestMatch: "Pertinence", priceAsc: "Prix ↑", priceDesc: "Prix ↓", fastest: "Plus rapide", price: "Prix", rating: "Note", distance: "Distance" },
    region: { global: "MONDIAL", us: "USA", eu: "EU", arab: "ARABE", asia: "ASIE" },
    language: { title: "Langue", select: "Choisir la langue" },
  },
  es: {
    tabs: { home: "Inicio", products: "Productos", flights: "Vuelos", hotels: "Hoteles" },
    priceHistory: { title: "Historial de precios", chart: "Historial", days: "d", allPlatforms: "Todos", loading: "Cargando historial...", current: "Actual", lowest: "Mínimo", highest: "Máximo", savings: "Podrías ahorrar", fromPeak: "del precio máximo", greatTime: "¡Buen momento para comprar — precio cerca del mínimo!", waitTime: "Precio cerca del máximo, considera esperar.", avgTime: "Precio en rango promedio." },
    priceAlert: { title: "Alerta de precio", setAlert: "Crear alerta", targetPrice: "Precio objetivo", currentPrice: "Precio actual", setBtn: "Crear alerta de precio", deleteBtn: "Eliminar alerta", triggered: "¡Precio bajó!", activeTitle: "Alerta activa", triggeredTitle: "¡Precio bajó! 🎉", alertWhen: "Alertar si baja de", nowBelow: "¡El precio actual está en tu objetivo o por debajo!", howItWorks: "Marcaremos esta alerta cuando el precio alcance tu objetivo.", savingsOf: "Ahorrarás", alreadyBelow: "El objetivo está sobre el precio actual — la alerta se activará inmediatamente", quickTargets: "Objetivos rápidos", invalidPrice: "Ingresa un precio válido", badge: "alertas de precio" },
    myAlerts: { title: "Mis alertas", triggered: "activada", tabAll: "Todo", tabTriggered: "Activadas", tabActive: "Activas", noAlerts: "Sin alertas aún", noAlertsMsg: "Configura alertas en las tarjetas de producto para ser notificado cuando bajen los precios.", browseProducts: "Ver productos", editAlert: "Editar alerta", saveBtn: "Guardar cambios", confirmDelete: "¿Eliminar alerta?", confirmDeleteMsg: "Esta alerta se eliminará permanentemente.", clearTriggered: "¿Borrar alertas activadas?", clearTriggeredMsg: "Se eliminarán todas las alertas activadas.", clearBtn: "Borrar todo", tapToEdit: "Toca para editar el precio objetivo" },
    localStores: { title: "Tiendas locales", open: "Abrir", disclaimer: "Toca una tienda para buscar en su web" },
    camera: { title: "Búsqueda por imagen", selectSource: "Buscar por imagen", takePhoto: "Tomar foto", chooseGallery: "Elegir de galería", cancel: "Cancelar", analyzing: "Analizando imagen...", detected: "Detectado", confidence: "Confianza", searchWith: "Buscar con esto", noResult: "No se pudo identificar el producto", permissionDenied: "Acceso a cámara denegado" },
    home: { title: "Safad Vibe", subtitle: "Busca productos, vuelos y hoteles", searchPlaceholder: "Buscar cualquier cosa...", recentSearches: "Búsquedas recientes", trendingProducts: "Productos tendencia", popularFlights: "Vuelos populares", hotelDestinations: "Destinos de hoteles", seeAll: "Ver todo" },
    products: { title: "Productos", searchPlaceholder: "Buscar productos...", noResults: "No se encontraron productos", noTrending: "Sin productos tendencia", checkBack: "Vuelve más tarde", tryDifferent: "Intenta otro término", searching: "Buscando...", loadingTrending: "Cargando tendencias..." },
    flights: { title: "Vuelos", from: "Desde (IATA)", to: "Hacia (IATA)", date: "Fecha (AAAA-MM-DD)", passengers: "Pasajeros", searchBtn: "Buscar vuelos", noResults: "No se encontraron vuelos", tryDifferent: "Intenta otras fechas o destinos", popularRoutes: "Rutas populares", direct: "Directo", stop: "escala", stops: "escalas", baggageIncluded: "Equipaje incluido", book: "Reservar", from: "desde", searchingFlights: "Buscando vuelos..." },
    hotels: { title: "Hoteles", destination: "Destino (ciudad u hotel)", checkin: "Entrada", checkout: "Salida", searchBtn: "Buscar hoteles", noResults: "No se encontraron hoteles", tryDifferent: "Intenta otras fechas o destino", popularDestinations: "Destinos populares", perNight: "por noche", book: "Reservar", findingHotels: "Buscando hoteles..." },
    cabin: { economy: "Económica", premium: "Premium", business: "Negocios", first: "Primera" },
    sort: { bestMatch: "Relevancia", priceAsc: "Precio ↑", priceDesc: "Precio ↓", fastest: "Más rápido", price: "Precio", rating: "Valoración", distance: "Distancia" },
    region: { global: "GLOBAL", us: "EE.UU.", eu: "EU", arab: "ÁRABE", asia: "ASIA" },
    language: { title: "Idioma", select: "Seleccionar idioma" },
  },
  de: {
    tabs: { home: "Start", products: "Produkte", flights: "Flüge", hotels: "Hotels" },
    priceHistory: { title: "Preisverlauf", chart: "Preisverlauf", days: "T", allPlatforms: "Alle", loading: "Lade Preisverlauf...", current: "Aktuell", lowest: "Niedrigst", highest: "Höchst", savings: "Sie könnten sparen", fromPeak: "vom Höchstpreis", greatTime: "Guter Kaufzeitpunkt — Preis nahe am Tiefstand!", waitTime: "Preis nahe am Höchststand, warten empfohlen.", avgTime: "Preis im durchschnittlichen Bereich." },
    priceAlert: { title: "Preisalarm", setAlert: "Alarm setzen", targetPrice: "Zielpreis", currentPrice: "Aktueller Preis", setBtn: "Preisalarm setzen", deleteBtn: "Alarm löschen", triggered: "Preis gesunken!", activeTitle: "Alarm aktiv", triggeredTitle: "Preis gesunken! 🎉", alertWhen: "Alarm wenn unter", nowBelow: "Der aktuelle Preis hat Ihr Ziel erreicht oder unterschritten!", howItWorks: "Wir markieren diesen Alarm, wenn der Preis Ihr Ziel erreicht.", savingsOf: "Sie sparen", alreadyBelow: "Ziel ist über dem aktuellen Preis — Alarm wird sofort ausgelöst", quickTargets: "Schnellziele", invalidPrice: "Bitte gültigen Preis eingeben", badge: "Preisalarme" },
    myAlerts: { title: "Meine Alarme", triggered: "ausgelöst", tabAll: "Alle", tabTriggered: "Ausgelöst", tabActive: "Aktiv", noAlerts: "Noch keine Alarme", noAlertsMsg: "Setzen Sie Alarme auf Produktkarten, um bei Preissenkungen benachrichtigt zu werden.", browseProducts: "Produkte durchsuchen", editAlert: "Alarm bearbeiten", saveBtn: "Änderungen speichern", confirmDelete: "Alarm entfernen?", confirmDeleteMsg: "Dieser Alarm wird dauerhaft entfernt.", clearTriggered: "Ausgelöste Alarme löschen?", clearTriggeredMsg: "Alle ausgelösten Alarme werden entfernt.", clearBtn: "Alle löschen", tapToEdit: "Tippen zum Bearbeiten des Zielpreises" },
    localStores: { title: "Lokale Shops", open: "Öffnen", disclaimer: "Auf Shop tippen zum Suchen" },
    camera: { title: "Bildsuche", selectSource: "Per Bild suchen", takePhoto: "Foto aufnehmen", chooseGallery: "Aus Galerie wählen", cancel: "Abbrechen", analyzing: "Bild wird analysiert...", detected: "Erkannt", confidence: "Zuverlässigkeit", searchWith: "Damit suchen", noResult: "Produkt nicht erkannt", permissionDenied: "Kamerazugriff verweigert" },
    home: { title: "Safad Vibe", subtitle: "Produkte, Flüge & Hotels suchen", searchPlaceholder: "Suche...", recentSearches: "Letzte Suchen", trendingProducts: "Trending Produkte", popularFlights: "Beliebte Flüge", hotelDestinations: "Hotelziele", seeAll: "Alle anzeigen" },
    products: { title: "Produkte", searchPlaceholder: "Produkte suchen...", noResults: "Keine Produkte gefunden", noTrending: "Keine Trends", checkBack: "Später zurückkommen", tryDifferent: "Anderen Begriff versuchen", searching: "Suche...", loadingTrending: "Trends laden..." },
    flights: { title: "Flüge", from: "Von (IATA)", to: "Nach (IATA)", date: "Datum (JJJJ-MM-TT)", passengers: "Passagiere", searchBtn: "Flüge suchen", noResults: "Keine Flüge gefunden", tryDifferent: "Andere Daten oder Ziele versuchen", popularRoutes: "Beliebte Strecken", direct: "Direkt", stop: "Stopp", stops: "Stopps", baggageIncluded: "Gepäck inklusive", book: "Buchen", from: "ab", searchingFlights: "Flüge suchen..." },
    hotels: { title: "Hotels", destination: "Ziel (Stadt oder Hotel)", checkin: "Check-in", checkout: "Check-out", searchBtn: "Hotels suchen", noResults: "Keine Hotels gefunden", tryDifferent: "Andere Daten oder Ziel versuchen", popularDestinations: "Beliebte Reiseziele", perNight: "pro Nacht", book: "Buchen", findingHotels: "Hotels suchen..." },
    cabin: { economy: "Economy", premium: "Premium", business: "Business", first: "Erste" },
    sort: { bestMatch: "Relevanz", priceAsc: "Preis ↑", priceDesc: "Preis ↓", fastest: "Schnellste", price: "Preis", rating: "Bewertung", distance: "Entfernung" },
    region: { global: "GLOBAL", us: "USA", eu: "EU", arab: "ARABISCH", asia: "ASIEN" },
    language: { title: "Sprache", select: "Sprache auswählen" },
  },
  it: {
    tabs: { home: "Home", products: "Prodotti", flights: "Voli", hotels: "Hotel" },
    priceHistory: { title: "Storico prezzi", chart: "Storico", days: "g", allPlatforms: "Tutti", loading: "Caricamento storico...", current: "Attuale", lowest: "Minimo", highest: "Massimo", savings: "Potresti risparmiare", fromPeak: "dal prezzo massimo", greatTime: "Ottimo momento per acquistare — prezzo vicino al minimo!", waitTime: "Prezzo vicino al massimo, considera di aspettare.", avgTime: "Prezzo nella media." },
    priceAlert: { title: "Avviso prezzo", setAlert: "Imposta avviso", targetPrice: "Prezzo obiettivo", currentPrice: "Prezzo attuale", setBtn: "Imposta avviso prezzo", deleteBtn: "Rimuovi avviso", triggered: "Prezzo sceso!", activeTitle: "Avviso attivo", triggeredTitle: "Prezzo sceso! 🎉", alertWhen: "Avvisa se sotto", nowBelow: "Il prezzo attuale è al tuo obiettivo o inferiore!", howItWorks: "Segnaleremo questo avviso quando il prezzo raggiungerà il tuo obiettivo.", savingsOf: "Risparmierai", alreadyBelow: "L'obiettivo è sopra il prezzo attuale — l'avviso si attiverà immediatamente", quickTargets: "Obiettivi rapidi", invalidPrice: "Inserisci un prezzo valido", badge: "avvisi prezzo" },
    myAlerts: { title: "I miei avvisi", triggered: "attivato", tabAll: "Tutti", tabTriggered: "Attivati", tabActive: "Attivi", noAlerts: "Nessun avviso ancora", noAlertsMsg: "Imposta avvisi sulle schede prodotto per essere notificato quando i prezzi scendono.", browseProducts: "Sfoglia prodotti", editAlert: "Modifica avviso", saveBtn: "Salva modifiche", confirmDelete: "Rimuovere avviso?", confirmDeleteMsg: "Questo avviso verrà rimosso definitivamente.", clearTriggered: "Cancellare avvisi attivati?", clearTriggeredMsg: "Tutti gli avvisi attivati verranno rimossi.", clearBtn: "Cancella tutto", tapToEdit: "Tocca per modificare il prezzo obiettivo" },
    localStores: { title: "Negozi locali", open: "Apri", disclaimer: "Tocca un negozio per cercare sul loro sito" },
    camera: { title: "Ricerca per immagine", selectSource: "Cerca per immagine", takePhoto: "Scatta foto", chooseGallery: "Scegli dalla galleria", cancel: "Annulla", analyzing: "Analisi immagine...", detected: "Rilevato", confidence: "Confidenza", searchWith: "Cerca con questo", noResult: "Prodotto non identificato", permissionDenied: "Accesso fotocamera negato" },
    home: { title: "Safad Vibe", subtitle: "Cerca prodotti, voli e hotel", searchPlaceholder: "Cerca qualsiasi cosa...", recentSearches: "Ricerche recenti", trendingProducts: "Prodotti di tendenza", popularFlights: "Voli popolari", hotelDestinations: "Destinazioni hotel", seeAll: "Vedi tutto" },
    products: { title: "Prodotti", searchPlaceholder: "Cerca prodotti...", noResults: "Nessun prodotto trovato", noTrending: "Nessun prodotto di tendenza", checkBack: "Ricontrolla più tardi", tryDifferent: "Prova un termine diverso", searching: "Ricerca...", loadingTrending: "Caricamento tendenze..." },
    flights: { title: "Voli", from: "Da (IATA)", to: "A (IATA)", date: "Data (AAAA-MM-GG)", passengers: "Passeggeri", searchBtn: "Cerca voli", noResults: "Nessun volo trovato", tryDifferent: "Prova date o destinazioni diverse", popularRoutes: "Rotte popolari", direct: "Diretto", stop: "scalo", stops: "scali", baggageIncluded: "Bagaglio incluso", book: "Prenota", from: "da", searchingFlights: "Ricerca voli..." },
    hotels: { title: "Hotel", destination: "Destinazione (città o hotel)", checkin: "Check-in", checkout: "Check-out", searchBtn: "Cerca hotel", noResults: "Nessun hotel trovato", tryDifferent: "Prova date o destinazione diversa", popularDestinations: "Destinazioni popolari", perNight: "a notte", book: "Prenota", findingHotels: "Ricerca hotel..." },
    cabin: { economy: "Economica", premium: "Premium", business: "Business", first: "Prima" },
    sort: { bestMatch: "Rilevanza", priceAsc: "Prezzo ↑", priceDesc: "Prezzo ↓", fastest: "Più veloce", price: "Prezzo", rating: "Valutazione", distance: "Distanza" },
    region: { global: "GLOBALE", us: "USA", eu: "EU", arab: "ARABO", asia: "ASIA" },
    language: { title: "Lingua", select: "Seleziona lingua" },
  },
  pt: {
    tabs: { home: "Início", products: "Produtos", flights: "Voos", hotels: "Hotéis" },
    priceHistory: { title: "Histórico de preços", chart: "Histórico", days: "d", allPlatforms: "Todos", loading: "Carregando histórico...", current: "Atual", lowest: "Mínimo", highest: "Máximo", savings: "Você pode economizar", fromPeak: "do preço máximo", greatTime: "Ótimo momento para comprar — preço perto do mínimo!", waitTime: "Preço perto do máximo, considere esperar.", avgTime: "Preço na faixa média." },
    priceAlert: { title: "Alerta de preço", setAlert: "Criar alerta", targetPrice: "Preço alvo", currentPrice: "Preço atual", setBtn: "Criar alerta de preço", deleteBtn: "Remover alerta", triggered: "Preço caiu!", activeTitle: "Alerta ativo", triggeredTitle: "Preço caiu! 🎉", alertWhen: "Alertar quando abaixo de", nowBelow: "O preço atual está no seu alvo ou abaixo!", howItWorks: "Marcaremos este alerta quando o preço atingir seu alvo.", savingsOf: "Você economizará", alreadyBelow: "O alvo está acima do preço atual — o alerta será acionado imediatamente", quickTargets: "Alvos rápidos", invalidPrice: "Digite um preço válido", badge: "alertas de preço" },
    myAlerts: { title: "Meus alertas", triggered: "ativado", tabAll: "Todos", tabTriggered: "Ativados", tabActive: "Ativos", noAlerts: "Sem alertas ainda", noAlertsMsg: "Defina alertas nos cards de produto para ser notificado quando os preços caírem.", browseProducts: "Ver produtos", editAlert: "Editar alerta", saveBtn: "Salvar alterações", confirmDelete: "Remover alerta?", confirmDeleteMsg: "Este alerta será removido permanentemente.", clearTriggered: "Limpar alertas ativados?", clearTriggeredMsg: "Todos os alertas ativados serão removidos.", clearBtn: "Limpar tudo", tapToEdit: "Toque para editar o preço alvo" },
    localStores: { title: "Lojas locais", open: "Abrir", disclaimer: "Toque em uma loja para buscar no site" },
    camera: { title: "Busca por imagem", selectSource: "Buscar por imagem", takePhoto: "Tirar foto", chooseGallery: "Escolher da galeria", cancel: "Cancelar", analyzing: "Analisando imagem...", detected: "Detectado", confidence: "Confiança", searchWith: "Buscar com isto", noResult: "Produto não identificado", permissionDenied: "Acesso à câmera negado" },
    home: { title: "Safad Vibe", subtitle: "Pesquise produtos, voos e hotéis", searchPlaceholder: "Pesquisar...", recentSearches: "Pesquisas recentes", trendingProducts: "Produtos em alta", popularFlights: "Voos populares", hotelDestinations: "Destinos de hotéis", seeAll: "Ver tudo" },
    products: { title: "Produtos", searchPlaceholder: "Pesquisar produtos...", noResults: "Nenhum produto encontrado", noTrending: "Sem produtos em alta", checkBack: "Volte mais tarde", tryDifferent: "Tente outro termo", searching: "Pesquisando...", loadingTrending: "Carregando tendências..." },
    flights: { title: "Voos", from: "De (IATA)", to: "Para (IATA)", date: "Data (AAAA-MM-DD)", passengers: "Passageiros", searchBtn: "Pesquisar voos", noResults: "Nenhum voo encontrado", tryDifferent: "Tente outras datas ou destinos", popularRoutes: "Rotas populares", direct: "Direto", stop: "escala", stops: "escalas", baggageIncluded: "Bagagem incluída", book: "Reservar", from: "a partir de", searchingFlights: "Pesquisando voos..." },
    hotels: { title: "Hotéis", destination: "Destino (cidade ou hotel)", checkin: "Check-in", checkout: "Check-out", searchBtn: "Pesquisar hotéis", noResults: "Nenhum hotel encontrado", tryDifferent: "Tente outras datas ou destino", popularDestinations: "Destinos populares", perNight: "por noite", book: "Reservar", findingHotels: "Procurando hotéis..." },
    cabin: { economy: "Econômica", premium: "Premium", business: "Executiva", first: "Primeira" },
    sort: { bestMatch: "Relevância", priceAsc: "Preço ↑", priceDesc: "Preço ↓", fastest: "Mais rápido", price: "Preço", rating: "Avaliação", distance: "Distância" },
    region: { global: "GLOBAL", us: "EUA", eu: "EU", arab: "ÁRABE", asia: "ÁSIA" },
    language: { title: "Idioma", select: "Selecionar idioma" },
  },
  ru: {
    tabs: { home: "Главная", products: "Товары", flights: "Рейсы", hotels: "Отели" },
    priceHistory: { title: "История цен", chart: "История цен", days: "д", allPlatforms: "Все", loading: "Загрузка истории цен...", current: "Текущая", lowest: "Минимум", highest: "Максимум", savings: "Вы можете сэкономить", fromPeak: "от пика цены", greatTime: "Отличное время для покупки — цена у минимума!", waitTime: "Цена у максимума, возможно стоит подождать.", avgTime: "Цена в среднем диапазоне." },
    priceAlert: { title: "Ценовой сигнал", setAlert: "Установить сигнал", targetPrice: "Целевая цена", currentPrice: "Текущая цена", setBtn: "Установить сигнал цены", deleteBtn: "Удалить сигнал", triggered: "Цена упала!", activeTitle: "Сигнал активен", triggeredTitle: "Цена упала! 🎉", alertWhen: "Сигнал когда ниже", nowBelow: "Текущая цена достигла вашей цели или ниже!", howItWorks: "Мы отметим этот сигнал, когда цена достигнет вашей цели.", savingsOf: "Вы сэкономите", alreadyBelow: "Цель выше текущей цены — сигнал сработает немедленно", quickTargets: "Быстрые цели", invalidPrice: "Введите корректную цену", badge: "ценовые сигналы" },
    myAlerts: { title: "Мои сигналы", triggered: "сработал", tabAll: "Все", tabTriggered: "Сработавшие", tabActive: "Активные", noAlerts: "Пока нет сигналов", noAlertsMsg: "Установите сигналы на карточках товаров, чтобы получать уведомления о снижении цен.", browseProducts: "Смотреть товары", editAlert: "Изменить сигнал", saveBtn: "Сохранить", confirmDelete: "Удалить сигнал?", confirmDeleteMsg: "Этот сигнал будет удалён навсегда.", clearTriggered: "Удалить сработавшие сигналы?", clearTriggeredMsg: "Все сработавшие сигналы будут удалены.", clearBtn: "Удалить все", tapToEdit: "Нажмите для изменения целевой цены" },
    localStores: { title: "Локальные магазины", open: "Открыть", disclaimer: "Нажмите на магазин для поиска на сайте" },
    camera: { title: "Поиск по фото", selectSource: "Поиск по изображению", takePhoto: "Сделать фото", chooseGallery: "Выбрать из галереи", cancel: "Отмена", analyzing: "Анализ изображения...", detected: "Обнаружено", confidence: "Уверенность", searchWith: "Искать по этому", noResult: "Товар не распознан", permissionDenied: "Доступ к камере запрещён" },
    home: { title: "Safad Vibe", subtitle: "Поиск товаров, рейсов и отелей", searchPlaceholder: "Поиск...", recentSearches: "Последние запросы", trendingProducts: "Популярные товары", popularFlights: "Популярные рейсы", hotelDestinations: "Направления отелей", seeAll: "Все" },
    products: { title: "Товары", searchPlaceholder: "Поиск товаров...", noResults: "Товары не найдены", noTrending: "Нет популярных товаров", checkBack: "Проверьте позже", tryDifferent: "Попробуйте другой запрос", searching: "Поиск...", loadingTrending: "Загрузка..." },
    flights: { title: "Рейсы", from: "Откуда (IATA)", to: "Куда (IATA)", date: "Дата (ГГГГ-ММ-ДД)", passengers: "Пассажиры", searchBtn: "Найти рейсы", noResults: "Рейсы не найдены", tryDifferent: "Попробуйте другие даты или направления", popularRoutes: "Популярные маршруты", direct: "Прямой", stop: "пересадка", stops: "пересадки", baggageIncluded: "Багаж включён", book: "Забронировать", from: "от", searchingFlights: "Поиск рейсов..." },
    hotels: { title: "Отели", destination: "Направление (город или отель)", checkin: "Заезд", checkout: "Выезд", searchBtn: "Найти отели", noResults: "Отели не найдены", tryDifferent: "Попробуйте другие даты или направление", popularDestinations: "Популярные направления", perNight: "за ночь", book: "Забронировать", findingHotels: "Поиск отелей..." },
    cabin: { economy: "Эконом", premium: "Премиум", business: "Бизнес", first: "Первый" },
    sort: { bestMatch: "Лучшее совпадение", priceAsc: "Цена ↑", priceDesc: "Цена ↓", fastest: "Быстрее", price: "Цена", rating: "Рейтинг", distance: "Расстояние" },
    region: { global: "ГЛОБАЛЬНО", us: "США", eu: "ЕС", arab: "АРАБСКИЙ", asia: "АЗИЯ" },
    language: { title: "Язык", select: "Выбрать язык" },
  },
  zh: {
    tabs: { home: "首页", products: "商品", flights: "航班", hotels: "酒店" },
    priceHistory: { title: "价格历史", chart: "价格走势", days: "天", allPlatforms: "全部", loading: "加载价格历史...", current: "当前", lowest: "最低", highest: "最高", savings: "可节省", fromPeak: "相比最高价", greatTime: "现在是购买好时机 — 价格接近最低点！", waitTime: "价格接近最高点，建议等待。", avgTime: "价格处于平均水平。" },
    priceAlert: { title: "价格提醒", setAlert: "设置提醒", targetPrice: "目标价格", currentPrice: "当前价格", setBtn: "设置价格提醒", deleteBtn: "删除提醒", triggered: "价格下降了！", activeTitle: "提醒已激活", triggeredTitle: "价格下降了！🎉", alertWhen: "低于时提醒", nowBelow: "当前价格已达到或低于您的目标！", howItWorks: "当价格达到您的目标时，我们会标记此提醒。", savingsOf: "您将节省", alreadyBelow: "目标高于当前价格 — 提醒将立即触发", quickTargets: "快速目标", invalidPrice: "请输入有效价格", badge: "价格提醒" },
    myAlerts: { title: "我的提醒", triggered: "已触发", tabAll: "全部", tabTriggered: "已触发", tabActive: "活跃", noAlerts: "暂无提醒", noAlertsMsg: "在产品卡上设置提醒，以便在价格下降时收到通知。", browseProducts: "浏览商品", editAlert: "编辑提醒", saveBtn: "保存更改", confirmDelete: "删除提醒？", confirmDeleteMsg: "此提醒将被永久删除。", clearTriggered: "清除已触发的提醒？", clearTriggeredMsg: "所有已触发的提醒将被删除。", clearBtn: "全部清除", tapToEdit: "点击编辑目标价格" },
    localStores: { title: "本地商店", open: "打开", disclaimer: "点击商店在其网站搜索" },
    camera: { title: "以图搜索", selectSource: "图片搜索", takePhoto: "拍照", chooseGallery: "从相册选择", cancel: "取消", analyzing: "正在分析图片...", detected: "已识别", confidence: "置信度", searchWith: "用此搜索", noResult: "无法识别商品", permissionDenied: "相机访问被拒绝" },
    home: { title: "Safad Vibe", subtitle: "搜索商品、航班和酒店", searchPlaceholder: "搜索任何内容...", recentSearches: "最近搜索", trendingProducts: "热门商品", popularFlights: "热门航班", hotelDestinations: "酒店目的地", seeAll: "查看全部" },
    products: { title: "商品", searchPlaceholder: "搜索商品...", noResults: "未找到商品", noTrending: "暂无热门商品", checkBack: "稍后再来", tryDifferent: "尝试其他搜索词", searching: "搜索中...", loadingTrending: "加载热门..." },
    flights: { title: "航班", from: "出发 (IATA)", to: "到达 (IATA)", date: "日期 (YYYY-MM-DD)", passengers: "乘客", searchBtn: "搜索航班", noResults: "未找到航班", tryDifferent: "尝试不同日期或目的地", popularRoutes: "热门路线", direct: "直飞", stop: "经停", stops: "经停", baggageIncluded: "含行李", book: "预订", from: "起", searchingFlights: "搜索航班中..." },
    hotels: { title: "酒店", destination: "目的地（城市或酒店）", checkin: "入住", checkout: "退房", searchBtn: "搜索酒店", noResults: "未找到酒店", tryDifferent: "尝试不同日期或目的地", popularDestinations: "热门目的地", perNight: "/晚", book: "预订", findingHotels: "查找酒店中..." },
    cabin: { economy: "经济舱", premium: "超级经济舱", business: "商务舱", first: "头等舱" },
    sort: { bestMatch: "最佳匹配", priceAsc: "价格 ↑", priceDesc: "价格 ↓", fastest: "最快", price: "价格", rating: "评分", distance: "距离" },
    region: { global: "全球", us: "美国", eu: "欧洲", arab: "阿拉伯", asia: "亚洲" },
    language: { title: "语言", select: "选择语言" },
  },
  ja: {
    tabs: { home: "ホーム", products: "商品", flights: "フライト", hotels: "ホテル" },
    priceHistory: { title: "価格履歴", chart: "価格推移", days: "日", allPlatforms: "全て", loading: "価格履歴を読み込み中...", current: "現在", lowest: "最安値", highest: "最高値", savings: "節約できます", fromPeak: "最高値から", greatTime: "今が買い時 — 価格は最安値に近い！", waitTime: "価格は最高値に近いです。待つことを検討してください。", avgTime: "価格は平均的な範囲です。" },
    priceAlert: { title: "価格アラート", setAlert: "アラート設定", targetPrice: "目標価格", currentPrice: "現在価格", setBtn: "価格アラートを設定", deleteBtn: "アラートを削除", triggered: "価格が下がりました！", activeTitle: "アラート有効", triggeredTitle: "価格が下がりました！🎉", alertWhen: "以下になったら通知", nowBelow: "現在の価格があなたの目標に達しました！", howItWorks: "価格が目標に達したらこのアラートをマークします。", savingsOf: "節約できます", alreadyBelow: "目標が現在価格より高い — アラートはすぐに発動します", quickTargets: "クイック目標", invalidPrice: "有効な価格を入力してください", badge: "価格アラート" },
    myAlerts: { title: "マイアラート", triggered: "発動済み", tabAll: "すべて", tabTriggered: "発動済み", tabActive: "有効", noAlerts: "まだアラートなし", noAlertsMsg: "商品カードでアラートを設定して、価格が下がったときに通知を受け取りましょう。", browseProducts: "商品を見る", editAlert: "アラートを編集", saveBtn: "変更を保存", confirmDelete: "アラートを削除？", confirmDeleteMsg: "このアラートは完全に削除されます。", clearTriggered: "発動済みアラートを削除？", clearTriggeredMsg: "発動済みのすべてのアラートが削除されます。", clearBtn: "すべて削除", tapToEdit: "タップして目標価格を編集" },
    localStores: { title: "国内ショップ", open: "開く", disclaimer: "ショップをタップしてサイトで検索" },
    camera: { title: "画像検索", selectSource: "画像で検索", takePhoto: "写真を撮る", chooseGallery: "ギャラリーから選択", cancel: "キャンセル", analyzing: "画像を分析中...", detected: "検出済み", confidence: "信頼度", searchWith: "これで検索", noResult: "商品を識別できませんでした", permissionDenied: "カメラへのアクセスが拒否されました" },
    home: { title: "Safad Vibe", subtitle: "商品・フライト・ホテルを検索", searchPlaceholder: "何でも検索...", recentSearches: "最近の検索", trendingProducts: "トレンド商品", popularFlights: "人気フライト", hotelDestinations: "ホテル目的地", seeAll: "すべて見る" },
    products: { title: "商品", searchPlaceholder: "商品を検索...", noResults: "商品が見つかりません", noTrending: "トレンド商品なし", checkBack: "後で確認してください", tryDifferent: "別の検索語を試してください", searching: "検索中...", loadingTrending: "読み込み中..." },
    flights: { title: "フライト", from: "出発地 (IATA)", to: "目的地 (IATA)", date: "日付 (YYYY-MM-DD)", passengers: "乗客", searchBtn: "フライトを検索", noResults: "フライトが見つかりません", tryDifferent: "別の日付または目的地を試してください", popularRoutes: "人気路線", direct: "直行", stop: "乗継", stops: "乗継", baggageIncluded: "手荷物込み", book: "予約", from: "から", searchingFlights: "フライトを検索中..." },
    hotels: { title: "ホテル", destination: "目的地（都市またはホテル）", checkin: "チェックイン", checkout: "チェックアウト", searchBtn: "ホテルを検索", noResults: "ホテルが見つかりません", tryDifferent: "別の日付または目的地を試してください", popularDestinations: "人気目的地", perNight: "/泊", book: "予約", findingHotels: "ホテルを探しています..." },
    cabin: { economy: "エコノミー", premium: "プレミアム", business: "ビジネス", first: "ファースト" },
    sort: { bestMatch: "関連度", priceAsc: "価格 ↑", priceDesc: "価格 ↓", fastest: "最速", price: "価格", rating: "評価", distance: "距離" },
    region: { global: "グローバル", us: "米国", eu: "EU", arab: "アラブ", asia: "アジア" },
    language: { title: "言語", select: "言語を選択" },
  },
  ko: {
    tabs: { home: "홈", products: "상품", flights: "항공편", hotels: "호텔" },
    priceHistory: { title: "가격 이력", chart: "가격 추이", days: "일", allPlatforms: "전체", loading: "가격 이력 로딩 중...", current: "현재", lowest: "최저", highest: "최고", savings: "절약 가능", fromPeak: "최고가 대비", greatTime: "구매 적기 — 최저가에 가깝습니다!", waitTime: "최고가에 가깝습니다. 기다리는 것을 고려하세요.", avgTime: "가격이 평균 범위에 있습니다." },
    priceAlert: { title: "가격 알림", setAlert: "알림 설정", targetPrice: "목표 가격", currentPrice: "현재 가격", setBtn: "가격 알림 설정", deleteBtn: "알림 삭제", triggered: "가격 하락!", activeTitle: "알림 활성", triggeredTitle: "가격 하락! 🎉", alertWhen: "이하일 때 알림", nowBelow: "현재 가격이 목표에 도달했습니다!", howItWorks: "가격이 목표에 도달하면 알림을 표시합니다.", savingsOf: "절약 가능", alreadyBelow: "목표가 현재 가격보다 높음 — 알림이 즉시 활성화됩니다", quickTargets: "빠른 목표", invalidPrice: "유효한 가격을 입력하세요", badge: "가격 알림" },
    myAlerts: { title: "내 알림", triggered: "활성화됨", tabAll: "전체", tabTriggered: "활성화", tabActive: "활성", noAlerts: "아직 알림 없음", noAlertsMsg: "상품 카드에서 알림을 설정하여 가격이 내려갈 때 알림을 받으세요.", browseProducts: "상품 보기", editAlert: "알림 편집", saveBtn: "변경 저장", confirmDelete: "알림 삭제?", confirmDeleteMsg: "이 알림은 영구적으로 삭제됩니다.", clearTriggered: "활성화된 알림 지우기?", clearTriggeredMsg: "활성화된 모든 알림이 삭제됩니다.", clearBtn: "모두 지우기", tapToEdit: "탭하여 목표 가격 편집" },
    localStores: { title: "국내 쇼핑몰", open: "열기", disclaimer: "탭하여 해당 사이트에서 검색" },
    camera: { title: "이미지 검색", selectSource: "이미지로 검색", takePhoto: "사진 촬영", chooseGallery: "갤러리에서 선택", cancel: "취소", analyzing: "이미지 분석 중...", detected: "감지됨", confidence: "신뢰도", searchWith: "이것으로 검색", noResult: "제품을 식별할 수 없습니다", permissionDenied: "카메라 접근이 거부되었습니다" },
    home: { title: "Safad Vibe", subtitle: "상품, 항공편, 호텔 검색", searchPlaceholder: "무엇이든 검색...", recentSearches: "최근 검색", trendingProducts: "인기 상품", popularFlights: "인기 항공편", hotelDestinations: "호텔 목적지", seeAll: "전체 보기" },
    products: { title: "상품", searchPlaceholder: "상품 검색...", noResults: "상품을 찾을 수 없습니다", noTrending: "인기 상품 없음", checkBack: "나중에 다시 확인하세요", tryDifferent: "다른 검색어를 시도하세요", searching: "검색 중...", loadingTrending: "로드 중..." },
    flights: { title: "항공편", from: "출발지 (IATA)", to: "도착지 (IATA)", date: "날짜 (YYYY-MM-DD)", passengers: "승객", searchBtn: "항공편 검색", noResults: "항공편을 찾을 수 없습니다", tryDifferent: "다른 날짜나 목적지를 시도하세요", popularRoutes: "인기 노선", direct: "직항", stop: "경유", stops: "경유", baggageIncluded: "수하물 포함", book: "예약", from: "부터", searchingFlights: "항공편 검색 중..." },
    hotels: { title: "호텔", destination: "목적지 (도시 또는 호텔)", checkin: "체크인", checkout: "체크아웃", searchBtn: "호텔 검색", noResults: "호텔을 찾을 수 없습니다", tryDifferent: "다른 날짜나 목적지를 시도하세요", popularDestinations: "인기 목적지", perNight: "/박", book: "예약", findingHotels: "호텔 찾는 중..." },
    cabin: { economy: "이코노미", premium: "프리미엄", business: "비즈니스", first: "퍼스트" },
    sort: { bestMatch: "관련순", priceAsc: "가격 ↑", priceDesc: "가격 ↓", fastest: "최단시간", price: "가격", rating: "평점", distance: "거리" },
    region: { global: "전체", us: "미국", eu: "유럽", arab: "아랍", asia: "아시아" },
    language: { title: "언어", select: "언어 선택" },
  },
  tr: {
    tabs: { home: "Ana Sayfa", products: "Ürünler", flights: "Uçuşlar", hotels: "Oteller" },
    priceHistory: { title: "Fiyat geçmişi", chart: "Fiyat trendi", days: "g", allPlatforms: "Tümü", loading: "Fiyat geçmişi yükleniyor...", current: "Mevcut", lowest: "En düşük", highest: "En yüksek", savings: "Tasarruf edebilirsiniz", fromPeak: "tepe fiyattan", greatTime: "Almak için harika zaman — fiyat en düşük seviyeye yakın!", waitTime: "Fiyat tepe noktasına yakın, beklemeyi düşünün.", avgTime: "Fiyat ortalama aralıkta." },
    priceAlert: { title: "Fiyat uyarısı", setAlert: "Uyarı kur", targetPrice: "Hedef fiyat", currentPrice: "Mevcut fiyat", setBtn: "Fiyat uyarısı kur", deleteBtn: "Uyarıyı sil", triggered: "Fiyat düştü!", activeTitle: "Uyarı aktif", triggeredTitle: "Fiyat düştü! 🎉", alertWhen: "Altına düşünce uyar", nowBelow: "Mevcut fiyat hedefinize ulaştı veya altında!", howItWorks: "Fiyat hedefinize ulaştığında bu uyarıyı işaretleyeceğiz.", savingsOf: "Tasarruf edersiniz", alreadyBelow: "Hedef mevcut fiyatın üzerinde — uyarı hemen tetiklenecek", quickTargets: "Hızlı hedefler", invalidPrice: "Geçerli bir fiyat girin", badge: "fiyat uyarıları" },
    myAlerts: { title: "Uyarılarım", triggered: "tetiklendi", tabAll: "Tümü", tabTriggered: "Tetiklendi", tabActive: "Aktif", noAlerts: "Henüz uyarı yok", noAlertsMsg: "Fiyatlar düştüğünde bildirim almak için ürün kartlarına uyarı ekleyin.", browseProducts: "Ürünlere bak", editAlert: "Uyarıyı düzenle", saveBtn: "Kaydet", confirmDelete: "Uyarı kaldırılsın mı?", confirmDeleteMsg: "Bu uyarı kalıcı olarak kaldırılacak.", clearTriggered: "Tetiklenen uyarılar temizlensin mi?", clearTriggeredMsg: "Tüm tetiklenen uyarılar kaldırılacak.", clearBtn: "Tümünü temizle", tapToEdit: "Hedef fiyatı düzenlemek için dokunun" },
    localStores: { title: "Yerel Mağazalar", open: "Aç", disclaimer: "Sitede arama için mağazaya tıklayın" },
    camera: { title: "Görsel Arama", selectSource: "Görselle ara", takePhoto: "Fotoğraf çek", chooseGallery: "Galeriden seç", cancel: "İptal", analyzing: "Görsel analiz ediliyor...", detected: "Tespit edildi", confidence: "Güven", searchWith: "Bununla ara", noResult: "Ürün tanımlanamadı", permissionDenied: "Kamera erişimi reddedildi" },
    home: { title: "Safad Vibe", subtitle: "Ürün, uçuş ve otel ara", searchPlaceholder: "Her şeyi ara...", recentSearches: "Son Aramalar", trendingProducts: "Trend Ürünler", popularFlights: "Popüler Uçuşlar", hotelDestinations: "Otel Destinasyonları", seeAll: "Tümünü gör" },
    products: { title: "Ürünler", searchPlaceholder: "Ürün ara...", noResults: "Ürün bulunamadı", noTrending: "Trend ürün yok", checkBack: "Daha sonra tekrar kontrol edin", tryDifferent: "Farklı bir arama terimi deneyin", searching: "Aranıyor...", loadingTrending: "Trendler yükleniyor..." },
    flights: { title: "Uçuşlar", from: "Nereden (IATA)", to: "Nereye (IATA)", date: "Tarih (YYYY-AA-GG)", passengers: "Yolcular", searchBtn: "Uçuş Ara", noResults: "Uçuş bulunamadı", tryDifferent: "Farklı tarihler veya destinasyonlar deneyin", popularRoutes: "Popüler Güzergahlar", direct: "Direkt", stop: "aktarma", stops: "aktarma", baggageIncluded: "Bagaj dahil", book: "Rezervasyon", from: "itibaren", searchingFlights: "Uçuşlar aranıyor..." },
    hotels: { title: "Oteller", destination: "Destinasyon (şehir veya otel)", checkin: "Giriş", checkout: "Çıkış", searchBtn: "Otel Ara", noResults: "Otel bulunamadı", tryDifferent: "Farklı tarihler veya destinasyon deneyin", popularDestinations: "Popüler Destinasyonlar", perNight: "gecelik", book: "Rezervasyon", findingHotels: "Oteller aranıyor..." },
    cabin: { economy: "Ekonomi", premium: "Premium", business: "İş", first: "Birinci" },
    sort: { bestMatch: "En İyi Eşleşme", priceAsc: "Fiyat ↑", priceDesc: "Fiyat ↓", fastest: "En Hızlı", price: "Fiyat", rating: "Puan", distance: "Mesafe" },
    region: { global: "KÜRESEL", us: "ABD", eu: "AB", arab: "ARAP", asia: "ASYA" },
    language: { title: "Dil", select: "Dil Seç" },
  },
  nl: {
    tabs: { home: "Home", products: "Producten", flights: "Vluchten", hotels: "Hotels" },
    priceHistory: { title: "Prijsgeschiedenis", chart: "Prijstrend", days: "d", allPlatforms: "Alle", loading: "Prijsgeschiedenis laden...", current: "Actueel", lowest: "Laagste", highest: "Hoogste", savings: "U kunt besparen", fromPeak: "van piekprijs", greatTime: "Goed moment om te kopen — prijs is bijna op het laagste!", waitTime: "Prijs bijna op het hoogste, overweeg te wachten.", avgTime: "Prijs in het gemiddelde bereik." },
    priceAlert: { title: "Prijsalert", setAlert: "Alert instellen", targetPrice: "Doelprijs", currentPrice: "Huidige prijs", setBtn: "Prijsalert instellen", deleteBtn: "Alert verwijderen", triggered: "Prijs gedaald!", activeTitle: "Alert actief", triggeredTitle: "Prijs gedaald! 🎉", alertWhen: "Alert als onder", nowBelow: "De huidige prijs heeft uw doel bereikt of is eronder!", howItWorks: "We markeren deze alert wanneer de prijs uw doel bereikt.", savingsOf: "U bespaart", alreadyBelow: "Doel is boven huidige prijs — alert wordt direct geactiveerd", quickTargets: "Snelle doelen", invalidPrice: "Voer een geldige prijs in", badge: "prijsalerts" },
    myAlerts: { title: "Mijn alerts", triggered: "geactiveerd", tabAll: "Alles", tabTriggered: "Geactiveerd", tabActive: "Actief", noAlerts: "Nog geen alerts", noAlertsMsg: "Stel alerts in op productkaarten om gewaarschuwd te worden bij prijsdalingen.", browseProducts: "Producten bekijken", editAlert: "Alert bewerken", saveBtn: "Wijzigingen opslaan", confirmDelete: "Alert verwijderen?", confirmDeleteMsg: "Deze alert wordt definitief verwijderd.", clearTriggered: "Geactiveerde alerts wissen?", clearTriggeredMsg: "Alle geactiveerde alerts worden verwijderd.", clearBtn: "Alles wissen", tapToEdit: "Tik om doelprijs te bewerken" },
    localStores: { title: "Lokale winkels", open: "Openen", disclaimer: "Tik op een winkel om te zoeken op hun site" },
    camera: { title: "Zoeken op afbeelding", selectSource: "Zoeken op afbeelding", takePhoto: "Foto maken", chooseGallery: "Kies uit galerij", cancel: "Annuleren", analyzing: "Afbeelding analyseren...", detected: "Gedetecteerd", confidence: "Zekerheid", searchWith: "Hiermee zoeken", noResult: "Product niet herkend", permissionDenied: "Cameratoegang geweigerd" },
    home: { title: "Safad Vibe", subtitle: "Zoek producten, vluchten & hotels", searchPlaceholder: "Zoek alles...", recentSearches: "Recente zoekopdrachten", trendingProducts: "Trending producten", popularFlights: "Populaire vluchten", hotelDestinations: "Hotelbestemmingen", seeAll: "Alles zien" },
    products: { title: "Producten", searchPlaceholder: "Zoek producten...", noResults: "Geen producten gevonden", noTrending: "Geen trending producten", checkBack: "Kom later terug", tryDifferent: "Probeer een andere zoekterm", searching: "Zoeken...", loadingTrending: "Trending laden..." },
    flights: { title: "Vluchten", from: "Van (IATA)", to: "Naar (IATA)", date: "Datum (JJJJ-MM-DD)", passengers: "Passagiers", searchBtn: "Vluchten zoeken", noResults: "Geen vluchten gevonden", tryDifferent: "Probeer andere datums of bestemmingen", popularRoutes: "Populaire routes", direct: "Direct", stop: "tussenstop", stops: "tussenstops", baggageIncluded: "Bagage inbegrepen", book: "Boeken", from: "vanaf", searchingFlights: "Vluchten zoeken..." },
    hotels: { title: "Hotels", destination: "Bestemming (stad of hotel)", checkin: "Check-in", checkout: "Check-out", searchBtn: "Hotels zoeken", noResults: "Geen hotels gevonden", tryDifferent: "Probeer andere datums of bestemming", popularDestinations: "Populaire bestemmingen", perNight: "per nacht", book: "Boeken", findingHotels: "Hotels zoeken..." },
    cabin: { economy: "Economy", premium: "Premium", business: "Business", first: "Eerste" },
    sort: { bestMatch: "Beste match", priceAsc: "Prijs ↑", priceDesc: "Prijs ↓", fastest: "Snelste", price: "Prijs", rating: "Beoordeling", distance: "Afstand" },
    region: { global: "GLOBAAL", us: "VS", eu: "EU", arab: "ARABISCH", asia: "AZIË" },
    language: { title: "Taal", select: "Taal selecteren" },
  },
  pl: {
    tabs: { home: "Główna", products: "Produkty", flights: "Loty", hotels: "Hotele" },
    priceHistory: { title: "Historia cen", chart: "Trend cen", days: "d", allPlatforms: "Wszystkie", loading: "Ładowanie historii cen...", current: "Aktualna", lowest: "Najniższa", highest: "Najwyższa", savings: "Możesz zaoszczędzić", fromPeak: "od ceny szczytowej", greatTime: "Dobry czas na zakup — cena bliska minimum!", waitTime: "Cena bliska szczytu, rozważ poczekanie.", avgTime: "Cena w przeciętnym zakresie." },
    priceAlert: { title: "Alert cenowy", setAlert: "Ustaw alert", targetPrice: "Cena docelowa", currentPrice: "Aktualna cena", setBtn: "Ustaw alert cenowy", deleteBtn: "Usuń alert", triggered: "Cena spadła!", activeTitle: "Alert aktywny", triggeredTitle: "Cena spadła! 🎉", alertWhen: "Alert gdy poniżej", nowBelow: "Aktualna cena osiągnęła twój cel lub jest poniżej!", howItWorks: "Oznaczymy ten alert gdy cena osiągnie twój cel.", savingsOf: "Zaoszczędzisz", alreadyBelow: "Cel jest powyżej aktualnej ceny — alert zostanie natychmiast aktywowany", quickTargets: "Szybkie cele", invalidPrice: "Wprowadź prawidłową cenę", badge: "alerty cenowe" },
    myAlerts: { title: "Moje alerty", triggered: "wyzwolony", tabAll: "Wszystkie", tabTriggered: "Wyzwolone", tabActive: "Aktywne", noAlerts: "Brak alertów", noAlertsMsg: "Ustaw alerty na kartach produktów, aby otrzymywać powiadomienia o spadkach cen.", browseProducts: "Przeglądaj produkty", editAlert: "Edytuj alert", saveBtn: "Zapisz zmiany", confirmDelete: "Usunąć alert?", confirmDeleteMsg: "Ten alert zostanie trwale usunięty.", clearTriggered: "Wyczyścić wyzwolone alerty?", clearTriggeredMsg: "Wszystkie wyzwolone alerty zostaną usunięte.", clearBtn: "Wyczyść wszystko", tapToEdit: "Dotknij, aby edytować cenę docelową" },
    localStores: { title: "Lokalne sklepy", open: "Otwórz", disclaimer: "Stuknij sklep, aby wyszukać na ich stronie" },
    camera: { title: "Wyszukiwanie obrazem", selectSource: "Szukaj obrazem", takePhoto: "Zrób zdjęcie", chooseGallery: "Wybierz z galerii", cancel: "Anuluj", analyzing: "Analizowanie obrazu...", detected: "Wykryto", confidence: "Pewność", searchWith: "Szukaj tym", noResult: "Nie można zidentyfikować produktu", permissionDenied: "Odmowa dostępu do kamery" },
    home: { title: "Safad Vibe", subtitle: "Szukaj produktów, lotów i hoteli", searchPlaceholder: "Szukaj czegokolwiek...", recentSearches: "Ostatnie wyszukiwania", trendingProducts: "Popularne produkty", popularFlights: "Popularne loty", hotelDestinations: "Destynacje hotelowe", seeAll: "Zobacz wszystkie" },
    products: { title: "Produkty", searchPlaceholder: "Szukaj produktów...", noResults: "Nie znaleziono produktów", noTrending: "Brak popularnych produktów", checkBack: "Sprawdź później", tryDifferent: "Spróbuj innego hasła", searching: "Szukam...", loadingTrending: "Ładowanie trendów..." },
    flights: { title: "Loty", from: "Z (IATA)", to: "Do (IATA)", date: "Data (RRRR-MM-DD)", passengers: "Pasażerowie", searchBtn: "Szukaj lotów", noResults: "Nie znaleziono lotów", tryDifferent: "Spróbuj innych dat lub destynacji", popularRoutes: "Popularne trasy", direct: "Bezpośredni", stop: "przesiadka", stops: "przesiadki", baggageIncluded: "Bagaż w cenie", book: "Zarezerwuj", from: "od", searchingFlights: "Szukam lotów..." },
    hotels: { title: "Hotele", destination: "Destynacja (miasto lub hotel)", checkin: "Zameldowanie", checkout: "Wymeldowanie", searchBtn: "Szukaj hoteli", noResults: "Nie znaleziono hoteli", tryDifferent: "Spróbuj innych dat lub destynacji", popularDestinations: "Popularne destynacje", perNight: "za noc", book: "Zarezerwuj", findingHotels: "Szukam hoteli..." },
    cabin: { economy: "Ekonomiczna", premium: "Premium", business: "Biznes", first: "Pierwsza" },
    sort: { bestMatch: "Najlepsza dopasowanie", priceAsc: "Cena ↑", priceDesc: "Cena ↓", fastest: "Najszybszy", price: "Cena", rating: "Ocena", distance: "Odległość" },
    region: { global: "GLOBALNY", us: "USA", eu: "EU", arab: "ARABSKI", asia: "AZJA" },
    language: { title: "Język", select: "Wybierz język" },
  },
  sv: {
    tabs: { home: "Hem", products: "Produkter", flights: "Flyg", hotels: "Hotell" },
    priceHistory: { title: "Prishistorik", chart: "Pristrend", days: "d", allPlatforms: "Alla", loading: "Laddar prishistorik...", current: "Aktuellt", lowest: "Lägsta", highest: "Högsta", savings: "Du kan spara", fromPeak: "från toppriset", greatTime: "Bra tid att köpa — priset är nära lägsta!", waitTime: "Priset är nära toppen, överväg att vänta.", avgTime: "Priset är i genomsnittligt intervall." },
    priceAlert: { title: "Prisvarning", setAlert: "Ställ in varning", targetPrice: "Målpris", currentPrice: "Aktuellt pris", setBtn: "Ställ in prisvarning", deleteBtn: "Ta bort varning", triggered: "Priset sjönk!", activeTitle: "Varning aktiv", triggeredTitle: "Priset sjönk! 🎉", alertWhen: "Varna när under", nowBelow: "Det aktuella priset har nått ditt mål eller är under!", howItWorks: "Vi markerar denna varning när priset når ditt mål.", savingsOf: "Du sparar", alreadyBelow: "Målet är ovanför aktuellt pris — varning aktiveras omedelbart", quickTargets: "Snabba mål", invalidPrice: "Ange ett giltigt pris", badge: "prisvarningar" },
    myAlerts: { title: "Mina varningar", triggered: "utlöst", tabAll: "Alla", tabTriggered: "Utlösta", tabActive: "Aktiva", noAlerts: "Inga varningar ännu", noAlertsMsg: "Ange varningar på produktkort för att få meddelanden när priserna sjunker.", browseProducts: "Bläddra produkter", editAlert: "Redigera varning", saveBtn: "Spara ändringar", confirmDelete: "Ta bort varning?", confirmDeleteMsg: "Den här varningen tas bort permanent.", clearTriggered: "Rensa utlösta varningar?", clearTriggeredMsg: "Alla utlösta varningar tas bort.", clearBtn: "Rensa allt", tapToEdit: "Tryck för att redigera målpris" },
    localStores: { title: "Lokala butiker", open: "Öppna", disclaimer: "Tryck på en butik för att söka på deras webbplats" },
    camera: { title: "Bildsökning", selectSource: "Sök med bild", takePhoto: "Ta foto", chooseGallery: "Välj från galleri", cancel: "Avbryt", analyzing: "Analyserar bild...", detected: "Detekterat", confidence: "Konfidensgrad", searchWith: "Sök med detta", noResult: "Kunde inte identifiera produkt", permissionDenied: "Kameraåtkomst nekad" },
    home: { title: "Safad Vibe", subtitle: "Sök produkter, flyg och hotell", searchPlaceholder: "Sök vad som helst...", recentSearches: "Senaste sökningar", trendingProducts: "Trendande produkter", popularFlights: "Populära flyg", hotelDestinations: "Hotellmål", seeAll: "Se alla" },
    products: { title: "Produkter", searchPlaceholder: "Sök produkter...", noResults: "Inga produkter hittades", noTrending: "Inga trendande produkter", checkBack: "Kom tillbaka senare", tryDifferent: "Prova en annan sökterm", searching: "Söker...", loadingTrending: "Laddar trender..." },
    flights: { title: "Flyg", from: "Från (IATA)", to: "Till (IATA)", date: "Datum (ÅÅÅÅ-MM-DD)", passengers: "Passagerare", searchBtn: "Sök flyg", noResults: "Inga flyg hittades", tryDifferent: "Prova andra datum eller destinationer", popularRoutes: "Populära rutter", direct: "Direkt", stop: "stopp", stops: "stopp", baggageIncluded: "Bagage ingår", book: "Boka", from: "från", searchingFlights: "Söker flyg..." },
    hotels: { title: "Hotell", destination: "Destination (stad eller hotell)", checkin: "Incheckning", checkout: "Utcheckning", searchBtn: "Sök hotell", noResults: "Inga hotell hittades", tryDifferent: "Prova andra datum eller destination", popularDestinations: "Populära destinationer", perNight: "per natt", book: "Boka", findingHotels: "Söker hotell..." },
    cabin: { economy: "Ekonomi", premium: "Premium", business: "Business", first: "Första" },
    sort: { bestMatch: "Bästa matchning", priceAsc: "Pris ↑", priceDesc: "Pris ↓", fastest: "Snabbaste", price: "Pris", rating: "Betyg", distance: "Avstånd" },
    region: { global: "GLOBAL", us: "USA", eu: "EU", arab: "ARABISK", asia: "ASIEN" },
    language: { title: "Språk", select: "Välj språk" },
  },
  fa: {
    tabs: { home: "خانه", products: "محصولات", flights: "پروازها", hotels: "هتل‌ها" },
    priceHistory: { title: "تاریخچه قیمت", chart: "روند قیمت", days: "ر", allPlatforms: "همه", loading: "بارگذاری تاریخچه قیمت...", current: "فعلی", lowest: "کمترین", highest: "بیشترین", savings: "می‌توانید صرفه‌جویی کنید", fromPeak: "از اوج قیمت", greatTime: "زمان خوبی برای خرید — قیمت نزدیک به پایین‌ترین حد!", waitTime: "قیمت نزدیک به اوج است، شاید بهتر باشد منتظر بمانید.", avgTime: "قیمت در محدوده متوسط است." },
    priceAlert: { title: "هشدار قیمت", setAlert: "تنظیم هشدار", targetPrice: "قیمت هدف", currentPrice: "قیمت فعلی", setBtn: "تنظیم هشدار قیمت", deleteBtn: "حذف هشدار", triggered: "قیمت کاهش یافت!", activeTitle: "هشدار فعال", triggeredTitle: "قیمت کاهش یافت! 🎉", alertWhen: "هشدار زیر", nowBelow: "قیمت فعلی به هدف شما رسیده یا پایین‌تر است!", howItWorks: "وقتی قیمت به هدف برسد این هشدار را علامت می‌زنیم.", savingsOf: "صرفه‌جویی می‌کنید", alreadyBelow: "هدف بالای قیمت فعلی است — هشدار فوراً فعال می‌شود", quickTargets: "اهداف سریع", invalidPrice: "لطفاً قیمت معتبری وارد کنید", badge: "هشدارهای قیمت" },
    myAlerts: { title: "هشدارهای من", triggered: "فعال شد", tabAll: "همه", tabTriggered: "فعال شده", tabActive: "فعال", noAlerts: "هنوز هشداری ندارید", noAlertsMsg: "روی کارت‌های محصول هشدار بگذارید تا هنگام کاهش قیمت مطلع شوید.", browseProducts: "مرور محصولات", editAlert: "ویرایش هشدار", saveBtn: "ذخیره", confirmDelete: "حذف هشدار؟", confirmDeleteMsg: "این هشدار برای همیشه حذف خواهد شد.", clearTriggered: "پاک کردن هشدارهای فعال شده؟", clearTriggeredMsg: "همه هشدارهای فعال شده حذف خواهند شد.", clearBtn: "پاک کردن همه", tapToEdit: "ضربه بزنید برای ویرایش قیمت هدف" },
    localStores: { title: "فروشگاه‌های محلی", open: "باز کردن", disclaimer: "برای جستجو روی فروشگاه ضربه بزنید" },
    camera: { title: "جستجو با تصویر", selectSource: "جستجو با عکس", takePhoto: "عکس بگیر", chooseGallery: "انتخاب از گالری", cancel: "لغو", analyzing: "در حال تحلیل تصویر...", detected: "شناسایی‌شده", confidence: "اطمینان", searchWith: "جستجو با این", noResult: "محصول شناسایی نشد", permissionDenied: "دسترسی به دوربین رد شد" },
    home: { title: "صفد وایب", subtitle: "جستجوی محصولات، پرواز و هتل", searchPlaceholder: "جستجو کنید...", recentSearches: "جستجوهای اخیر", trendingProducts: "محصولات پرطرفدار", popularFlights: "پروازهای محبوب", hotelDestinations: "مقصدهای هتل", seeAll: "مشاهده همه" },
    products: { title: "محصولات", searchPlaceholder: "جستجوی محصولات...", noResults: "محصولی یافت نشد", noTrending: "محصول پرطرفداری وجود ندارد", checkBack: "بعداً بررسی کنید", tryDifferent: "عبارت دیگری امتحان کنید", searching: "در حال جستجو...", loadingTrending: "بارگذاری..." },
    flights: { title: "پروازها", from: "از (IATA)", to: "به (IATA)", date: "تاریخ (YYYY-MM-DD)", passengers: "مسافران", searchBtn: "جستجوی پرواز", noResults: "پروازی یافت نشد", tryDifferent: "تاریخ یا مقصد دیگری امتحان کنید", popularRoutes: "مسیرهای محبوب", direct: "مستقیم", stop: "توقف", stops: "توقف", baggageIncluded: "بار مجاز شامل", book: "رزرو", from: "از", searchingFlights: "در حال جستجوی پرواز..." },
    hotels: { title: "هتل‌ها", destination: "مقصد (شهر یا هتل)", checkin: "ورود", checkout: "خروج", searchBtn: "جستجوی هتل", noResults: "هتلی یافت نشد", tryDifferent: "تاریخ یا مقصد دیگری امتحان کنید", popularDestinations: "مقصدهای محبوب", perNight: "در شب", book: "رزرو", findingHotels: "در حال جستجوی هتل..." },
    cabin: { economy: "اقتصادی", premium: "پریمیوم", business: "تجاری", first: "اول" },
    sort: { bestMatch: "بهترین تطابق", priceAsc: "قیمت ↑", priceDesc: "قیمت ↓", fastest: "سریع‌ترین", price: "قیمت", rating: "امتیاز", distance: "فاصله" },
    region: { global: "جهانی", us: "آمریکا", eu: "اروپا", arab: "عربی", asia: "آسیا" },
    language: { title: "زبان", select: "انتخاب زبان" },
  },
  ur: {
    tabs: { home: "ہوم", products: "مصنوعات", flights: "پروازیں", hotels: "ہوٹل" },
    priceHistory: { title: "قیمت کی تاریخ", chart: "قیمت کا رجحان", days: "د", allPlatforms: "سب", loading: "قیمت کی تاریخ لوڈ ہو رہی ہے...", current: "موجودہ", lowest: "کم ترین", highest: "زیادہ ترین", savings: "آپ بچا سکتے ہیں", fromPeak: "سب سے زیادہ قیمت سے", greatTime: "خریداری کا بہترین وقت — قیمت سب سے کم کے قریب!", waitTime: "قیمت اپنے عروج کے قریب ہے، انتظار پر غور کریں۔", avgTime: "قیمت اوسط حد میں ہے۔" },
    priceAlert: { title: "قیمت کی اطلاع", setAlert: "اطلاع ترتیب دیں", targetPrice: "ہدف قیمت", currentPrice: "موجودہ قیمت", setBtn: "قیمت کی اطلاع ترتیب دیں", deleteBtn: "اطلاع حذف کریں", triggered: "قیمت گر گئی!", activeTitle: "اطلاع فعال", triggeredTitle: "قیمت گر گئی! 🎉", alertWhen: "جب کم ہو اطلاع دیں", nowBelow: "موجودہ قیمت آپ کے ہدف تک پہنچ گئی یا اس سے کم ہے!", howItWorks: "جب قیمت ہدف تک پہنچے گی اس اطلاع کو نشان زد کریں گے۔", savingsOf: "آپ بچائیں گے", alreadyBelow: "ہدف موجودہ قیمت سے اوپر ہے — اطلاع فوری طور پر متحرک ہو گی", quickTargets: "فوری اہداف", invalidPrice: "براہ کرم درست قیمت درج کریں", badge: "قیمت کی اطلاعات" },
    myAlerts: { title: "میری اطلاعات", triggered: "متحرک ہوئی", tabAll: "سب", tabTriggered: "متحرک", tabActive: "فعال", noAlerts: "ابھی کوئی اطلاع نہیں", noAlertsMsg: "قیمتیں گرنے پر اطلاع پانے کے لیے مصنوعات کے کارڈز پر اطلاعات ترتیب دیں۔", browseProducts: "مصنوعات دیکھیں", editAlert: "اطلاع ترمیم کریں", saveBtn: "تبدیلیاں محفوظ کریں", confirmDelete: "اطلاع حذف کریں؟", confirmDeleteMsg: "یہ اطلاع مستقل طور پر حذف ہو جائے گی۔", clearTriggered: "متحرک اطلاعات صاف کریں؟", clearTriggeredMsg: "تمام متحرک اطلاعات حذف ہو جائیں گی۔", clearBtn: "سب صاف کریں", tapToEdit: "ہدف قیمت ترمیم کرنے کے لیے ٹیپ کریں" },
    localStores: { title: "مقامی دکانیں", open: "کھولیں", disclaimer: "دکان پر ٹیپ کریں ان کی ویب سائٹ پر تلاش کرنے کے لیے" },
    camera: { title: "تصویر سے تلاش", selectSource: "تصویر سے تلاش کریں", takePhoto: "تصویر لیں", chooseGallery: "گیلری سے منتخب کریں", cancel: "منسوخ", analyzing: "تصویر تجزیہ ہو رہی ہے...", detected: "شناخت ہوا", confidence: "اعتماد", searchWith: "اس سے تلاش کریں", noResult: "مصنوع شناخت نہیں ہو سکا", permissionDenied: "کیمرہ تک رسائی سے انکار" },
    home: { title: "صفد وائب", subtitle: "مصنوعات، پروازیں اور ہوٹل تلاش کریں", searchPlaceholder: "کچھ بھی تلاش کریں...", recentSearches: "حالیہ تلاشیں", trendingProducts: "ٹرینڈنگ مصنوعات", popularFlights: "مشہور پروازیں", hotelDestinations: "ہوٹل مقامات", seeAll: "سب دیکھیں" },
    products: { title: "مصنوعات", searchPlaceholder: "مصنوعات تلاش کریں...", noResults: "کوئی مصنوع نہیں ملا", noTrending: "کوئی ٹرینڈنگ مصنوع نہیں", checkBack: "بعد میں چیک کریں", tryDifferent: "کوئی اور اصطلاح آزمائیں", searching: "تلاش کر رہے ہیں...", loadingTrending: "لوڈ ہو رہا ہے..." },
    flights: { title: "پروازیں", from: "سے (IATA)", to: "تک (IATA)", date: "تاریخ (YYYY-MM-DD)", passengers: "مسافر", searchBtn: "پروازیں تلاش کریں", noResults: "کوئی پرواز نہیں ملی", tryDifferent: "مختلف تاریخیں یا منازل آزمائیں", popularRoutes: "مشہور راستے", direct: "براہ راست", stop: "اسٹاپ", stops: "اسٹاپ", baggageIncluded: "سامان شامل", book: "بک کریں", from: "سے", searchingFlights: "پروازیں تلاش ہو رہی ہیں..." },
    hotels: { title: "ہوٹل", destination: "منزل (شہر یا ہوٹل)", checkin: "چیک ان", checkout: "چیک آؤٹ", searchBtn: "ہوٹل تلاش کریں", noResults: "کوئی ہوٹل نہیں ملا", tryDifferent: "مختلف تاریخیں یا منزل آزمائیں", popularDestinations: "مشہور منازل", perNight: "فی رات", book: "بک کریں", findingHotels: "ہوٹل تلاش ہو رہے ہیں..." },
    cabin: { economy: "اکانومی", premium: "پریمیم", business: "بزنس", first: "فرسٹ" },
    sort: { bestMatch: "بہترین میچ", priceAsc: "قیمت ↑", priceDesc: "قیمت ↓", fastest: "تیز ترین", price: "قیمت", rating: "درجہ بندی", distance: "فاصلہ" },
    region: { global: "عالمی", us: "امریکہ", eu: "یورپ", arab: "عربی", asia: "ایشیا" },
    language: { title: "زبان", select: "زبان منتخب کریں" },
  },
  hi: {
    tabs: { home: "होम", products: "उत्पाद", flights: "उड़ानें", hotels: "होटल" },
    priceHistory: { title: "मूल्य इतिहास", chart: "मूल्य प्रवृत्ति", days: "दि", allPlatforms: "सभी", loading: "मूल्य इतिहास लोड हो रहा है...", current: "वर्तमान", lowest: "न्यूनतम", highest: "अधिकतम", savings: "आप बचा सकते हैं", fromPeak: "उच्चतम मूल्य से", greatTime: "खरीदने का शानदार समय — कीमत सबसे कम के पास!", waitTime: "कीमत शिखर के पास है, प्रतीक्षा करें।", avgTime: "कीमत औसत सीमा में है।" },
    priceAlert: { title: "मूल्य अलर्ट", setAlert: "अलर्ट सेट करें", targetPrice: "लक्ष्य मूल्य", currentPrice: "वर्तमान मूल्य", setBtn: "मूल्य अलर्ट सेट करें", deleteBtn: "अलर्ट हटाएं", triggered: "कीमत गिरी!", activeTitle: "अलर्ट सक्रिय", triggeredTitle: "कीमत गिरी! 🎉", alertWhen: "से नीचे होने पर अलर्ट", nowBelow: "वर्तमान कीमत आपके लक्ष्य तक पहुंच गई या उससे कम है!", howItWorks: "जब कीमत आपके लक्ष्य तक पहुंचेगी तो हम इस अलर्ट को चिह्नित करेंगे।", savingsOf: "आप बचाएंगे", alreadyBelow: "लक्ष्य वर्तमान कीमत से अधिक है — अलर्ट तुरंत सक्रिय होगा", quickTargets: "त्वरित लक्ष्य", invalidPrice: "कृपया एक वैध कीमत दर्ज करें", badge: "मूल्य अलर्ट" },
    myAlerts: { title: "मेरे अलर्ट", triggered: "सक्रिय", tabAll: "सभी", tabTriggered: "सक्रिय", tabActive: "चालू", noAlerts: "अभी कोई अलर्ट नहीं", noAlertsMsg: "कीमत गिरने पर सूचना पाने के लिए उत्पाद कार्ड पर अलर्ट सेट करें।", browseProducts: "उत्पाद देखें", editAlert: "अलर्ट संपादित करें", saveBtn: "परिवर्तन सहेजें", confirmDelete: "अलर्ट हटाएं?", confirmDeleteMsg: "यह अलर्ट स्थायी रूप से हटाया जाएगा।", clearTriggered: "सक्रिय अलर्ट साफ करें?", clearTriggeredMsg: "सभी सक्रिय अलर्ट हटा दिए जाएंगे।", clearBtn: "सब साफ करें", tapToEdit: "लक्ष्य मूल्य संपादित करने के लिए टैप करें" },
    localStores: { title: "स्थानीय दुकानें", open: "खोलें", disclaimer: "उनकी साइट पर खोजने के लिए दुकान पर टैप करें" },
    camera: { title: "छवि खोज", selectSource: "छवि से खोजें", takePhoto: "फ़ोटो लें", chooseGallery: "गैलरी से चुनें", cancel: "रद्द करें", analyzing: "छवि विश्लेषण हो रहा है...", detected: "पहचाना गया", confidence: "विश्वास", searchWith: "इससे खोजें", noResult: "उत्पाद पहचाना नहीं जा सका", permissionDenied: "कैमरा पहुँच अस्वीकृत" },
    home: { title: "Safad Vibe", subtitle: "उत्पाद, उड़ानें और होटल खोजें", searchPlaceholder: "कुछ भी खोजें...", recentSearches: "हालिया खोजें", trendingProducts: "ट्रेंडिंग उत्पाद", popularFlights: "लोकप्रिय उड़ानें", hotelDestinations: "होटल गंतव्य", seeAll: "सभी देखें" },
    products: { title: "उत्पाद", searchPlaceholder: "उत्पाद खोजें...", noResults: "कोई उत्पाद नहीं मिला", noTrending: "कोई ट्रेंडिंग उत्पाद नहीं", checkBack: "बाद में देखें", tryDifferent: "कोई और शब्द आज़माएं", searching: "खोज रहे हैं...", loadingTrending: "लोड हो रहा है..." },
    flights: { title: "उड़ानें", from: "से (IATA)", to: "तक (IATA)", date: "तिथि (YYYY-MM-DD)", passengers: "यात्री", searchBtn: "उड़ानें खोजें", noResults: "कोई उड़ान नहीं मिली", tryDifferent: "अलग तिथियाँ या गंतव्य आज़माएं", popularRoutes: "लोकप्रिय मार्ग", direct: "सीधी", stop: "स्टॉप", stops: "स्टॉप", baggageIncluded: "सामान शामिल", book: "बुक करें", from: "से", searchingFlights: "उड़ानें खोज रहे हैं..." },
    hotels: { title: "होटल", destination: "गंतव्य (शहर या होटल)", checkin: "चेक-इन", checkout: "चेक-आउट", searchBtn: "होटल खोजें", noResults: "कोई होटल नहीं मिला", tryDifferent: "अलग तिथियाँ या गंतव्य आज़माएं", popularDestinations: "लोकप्रिय गंतव्य", perNight: "प्रति रात", book: "बुक करें", findingHotels: "होटल ढूंढ रहे हैं..." },
    cabin: { economy: "इकोनॉमी", premium: "प्रीमियम", business: "बिजनेस", first: "फर्स्ट" },
    sort: { bestMatch: "सर्वश्रेष्ठ", priceAsc: "कीमत ↑", priceDesc: "कीमत ↓", fastest: "सबसे तेज़", price: "कीमत", rating: "रेटिंग", distance: "दूरी" },
    region: { global: "वैश्विक", us: "यूएसए", eu: "यूरोप", arab: "अरबी", asia: "एशिया" },
    language: { title: "भाषा", select: "भाषा चुनें" },
  },
  id: {
    tabs: { home: "Beranda", products: "Produk", flights: "Penerbangan", hotels: "Hotel" },
    priceHistory: { title: "Riwayat harga", chart: "Tren harga", days: "h", allPlatforms: "Semua", loading: "Memuat riwayat harga...", current: "Saat ini", lowest: "Terendah", highest: "Tertinggi", savings: "Anda bisa hemat", fromPeak: "dari harga tertinggi", greatTime: "Waktu yang tepat untuk membeli — harga mendekati terendah!", waitTime: "Harga mendekati tertinggi, pertimbangkan untuk menunggu.", avgTime: "Harga dalam rentang rata-rata." },
    priceAlert: { title: "Peringatan harga", setAlert: "Buat peringatan", targetPrice: "Harga target", currentPrice: "Harga saat ini", setBtn: "Buat peringatan harga", deleteBtn: "Hapus peringatan", triggered: "Harga turun!", activeTitle: "Peringatan aktif", triggeredTitle: "Harga turun! 🎉", alertWhen: "Peringatkan jika di bawah", nowBelow: "Harga saat ini telah mencapai target atau di bawahnya!", howItWorks: "Kami akan menandai peringatan ini ketika harga mencapai target Anda.", savingsOf: "Anda akan hemat", alreadyBelow: "Target di atas harga saat ini — peringatan akan segera aktif", quickTargets: "Target cepat", invalidPrice: "Masukkan harga yang valid", badge: "peringatan harga" },
    myAlerts: { title: "Peringatan saya", triggered: "dipicu", tabAll: "Semua", tabTriggered: "Dipicu", tabActive: "Aktif", noAlerts: "Belum ada peringatan", noAlertsMsg: "Atur peringatan pada kartu produk untuk mendapat notifikasi saat harga turun.", browseProducts: "Lihat produk", editAlert: "Edit peringatan", saveBtn: "Simpan perubahan", confirmDelete: "Hapus peringatan?", confirmDeleteMsg: "Peringatan ini akan dihapus secara permanen.", clearTriggered: "Hapus peringatan yang dipicu?", clearTriggeredMsg: "Semua peringatan yang dipicu akan dihapus.", clearBtn: "Hapus semua", tapToEdit: "Ketuk untuk edit harga target" },
    localStores: { title: "Toko Lokal", open: "Buka", disclaimer: "Ketuk toko untuk mencari di situs mereka" },
    camera: { title: "Cari dengan Gambar", selectSource: "Cari dengan gambar", takePhoto: "Ambil foto", chooseGallery: "Pilih dari galeri", cancel: "Batal", analyzing: "Menganalisis gambar...", detected: "Terdeteksi", confidence: "Keyakinan", searchWith: "Cari dengan ini", noResult: "Produk tidak dapat diidentifikasi", permissionDenied: "Akses kamera ditolak" },
    home: { title: "Safad Vibe", subtitle: "Cari produk, penerbangan & hotel", searchPlaceholder: "Cari apa saja...", recentSearches: "Pencarian Terbaru", trendingProducts: "Produk Trending", popularFlights: "Penerbangan Populer", hotelDestinations: "Tujuan Hotel", seeAll: "Lihat semua" },
    products: { title: "Produk", searchPlaceholder: "Cari produk...", noResults: "Produk tidak ditemukan", noTrending: "Tidak ada produk trending", checkBack: "Cek lagi nanti", tryDifferent: "Coba kata kunci lain", searching: "Mencari...", loadingTrending: "Memuat trending..." },
    flights: { title: "Penerbangan", from: "Dari (IATA)", to: "Ke (IATA)", date: "Tanggal (YYYY-MM-DD)", passengers: "Penumpang", searchBtn: "Cari Penerbangan", noResults: "Penerbangan tidak ditemukan", tryDifferent: "Coba tanggal atau tujuan lain", popularRoutes: "Rute Populer", direct: "Langsung", stop: "transit", stops: "transit", baggageIncluded: "Bagasi termasuk", book: "Pesan", from: "mulai", searchingFlights: "Mencari penerbangan..." },
    hotels: { title: "Hotel", destination: "Tujuan (kota atau hotel)", checkin: "Check-in", checkout: "Check-out", searchBtn: "Cari Hotel", noResults: "Hotel tidak ditemukan", tryDifferent: "Coba tanggal atau tujuan lain", popularDestinations: "Destinasi Populer", perNight: "per malam", book: "Pesan", findingHotels: "Mencari hotel..." },
    cabin: { economy: "Ekonomi", premium: "Premium", business: "Bisnis", first: "Pertama" },
    sort: { bestMatch: "Paling Relevan", priceAsc: "Harga ↑", priceDesc: "Harga ↓", fastest: "Tercepat", price: "Harga", rating: "Penilaian", distance: "Jarak" },
    region: { global: "GLOBAL", us: "AS", eu: "EU", arab: "ARAB", asia: "ASIA" },
    language: { title: "Bahasa", select: "Pilih Bahasa" },
  },
  no: {
    tabs: { home: "Hjem", products: "Produkter", flights: "Fly", hotels: "Hoteller" },
    priceHistory: { title: "Prishistorikk", chart: "Pristrend", days: "d", allPlatforms: "Alle", loading: "Laster prishistorikk...", current: "Nåværende", lowest: "Laveste", highest: "Høyeste", savings: "Du kan spare", fromPeak: "fra toppris", greatTime: "Bra tid å kjøpe — prisen er nær det laveste!", waitTime: "Prisen er nær toppen, vurder å vente.", avgTime: "Prisen er i gjennomsnittlig rekkevidde." },
    priceAlert: { title: "Prisvarsel", setAlert: "Sett varsel", targetPrice: "Målpris", currentPrice: "Nåværende pris", setBtn: "Sett prisvarsel", deleteBtn: "Fjern varsel", triggered: "Prisen falt!", activeTitle: "Varsel aktivt", triggeredTitle: "Prisen falt! 🎉", alertWhen: "Varsle når under", nowBelow: "Nåværende pris har nådd målet ditt eller er under!", howItWorks: "Vi markerer dette varselet når prisen når målet ditt.", savingsOf: "Du sparer", alreadyBelow: "Målet er over nåværende pris — varselet aktiveres umiddelbart", quickTargets: "Raske mål", invalidPrice: "Skriv inn en gyldig pris", badge: "prisvarsler" },
    myAlerts: { title: "Mine varsler", triggered: "utløst", tabAll: "Alle", tabTriggered: "Utløste", tabActive: "Aktive", noAlerts: "Ingen varsler ennå", noAlertsMsg: "Sett varsler på produktkort for å bli varslet når prisene faller.", browseProducts: "Se produkter", editAlert: "Rediger varsel", saveBtn: "Lagre endringer", confirmDelete: "Fjerne varsel?", confirmDeleteMsg: "Dette varselet slettes permanent.", clearTriggered: "Fjerne utløste varsler?", clearTriggeredMsg: "Alle utløste varsler fjernes.", clearBtn: "Fjern alle", tapToEdit: "Trykk for å redigere målpris" },
    localStores: { title: "Lokale butikker", open: "Åpne", disclaimer: "Trykk på en butikk for å søke på deres nettside" },
    camera: { title: "Søk med bilde", selectSource: "Søk med bilde", takePhoto: "Ta bilde", chooseGallery: "Velg fra galleri", cancel: "Avbryt", analyzing: "Analyserer bilde...", detected: "Oppdaget", confidence: "Sikkerhet", searchWith: "Søk med dette", noResult: "Kunne ikke identifisere produkt", permissionDenied: "Kameratilgang nektet" },
    home: { title: "Safad Vibe", subtitle: "Søk etter produkter, fly og hoteller", searchPlaceholder: "Søk etter hva som helst...", recentSearches: "Siste søk", trendingProducts: "Trending produkter", popularFlights: "Populære fly", hotelDestinations: "Hotelldestinasjoner", seeAll: "Se alle" },
    products: { title: "Produkter", searchPlaceholder: "Søk etter produkter...", noResults: "Ingen produkter funnet", noTrending: "Ingen trending produkter", checkBack: "Kom tilbake senere", tryDifferent: "Prøv et annet søkeord", searching: "Søker...", loadingTrending: "Laster trender..." },
    flights: { title: "Fly", from: "Fra (IATA)", to: "Til (IATA)", date: "Dato (ÅÅÅÅ-MM-DD)", passengers: "Passasjerer", searchBtn: "Søk fly", noResults: "Ingen fly funnet", tryDifferent: "Prøv andre datoer eller destinasjoner", popularRoutes: "Populære ruter", direct: "Direkte", stop: "stopp", stops: "stopp", baggageIncluded: "Bagasje inkludert", book: "Bestill", from: "fra", searchingFlights: "Søker fly..." },
    hotels: { title: "Hoteller", destination: "Destinasjon (by eller hotell)", checkin: "Innsjekk", checkout: "Utsjekk", searchBtn: "Søk hoteller", noResults: "Ingen hoteller funnet", tryDifferent: "Prøv andre datoer eller destinasjon", popularDestinations: "Populære destinasjoner", perNight: "per natt", book: "Bestill", findingHotels: "Søker hoteller..." },
    cabin: { economy: "Økonomi", premium: "Premium", business: "Business", first: "Første" },
    sort: { bestMatch: "Beste treff", priceAsc: "Pris ↑", priceDesc: "Pris ↓", fastest: "Raskest", price: "Pris", rating: "Vurdering", distance: "Avstand" },
    region: { global: "GLOBAL", us: "USA", eu: "EU", arab: "ARABISK", asia: "ASIA" },
    language: { title: "Språk", select: "Velg språk" },
  },
};

export default t;
