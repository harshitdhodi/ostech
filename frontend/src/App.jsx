import './App.css';
import { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Cookies from "js-cookie";
import WhatsAppButton from './Clientside/components/WhatsappButton';
import Chatbot from './Clientside/pages/Chatbot';
import ScrollToTop from './Clientside/components/ScrollToTop';
import axios from 'axios';

// Lazy load components
const Sidebar = lazy(() => import('./Components/Sidebar'));
const Services = lazy(() => import('./Components/Pages/Services'));
const CreateService = lazy(() => import("./Components/Pages/CreateService"));
const EditService = lazy(() => import('./Components/Pages/EditService'));
const ServiceCategory = lazy(() => import("./Components/Pages/Servicecategory"));
const CreateServiceCategory = lazy(() => import("./Components/Pages/CreateServiceCategory"));
const EditServiceCategory = lazy(() => import("./Components/Pages/EditServiceCategory"));
const News = lazy(() => import("./Components/Pages/News"));
const CreateNews = lazy(() => import("./Components/Pages/CreateNews"));
const EditNews = lazy(() => import('./Components/Pages/EditNews'));
const NewsCategory = lazy(() => import("./Components/Pages/NewsCategory"));
const CreateNewsCategory = lazy(() => import("./Components/Pages/CreateNewsCategory"));
const EditNewsCategory = lazy(() => import("./Components/Pages/EditNewsCategory"));
const Testimonials = lazy(() => import('./Components/Pages/Testimonials'));
const CreateTestimonials = lazy(() => import('./Components/Pages/CreateTestimonials'));
const EditTestimonials = lazy(() => import('./Components/Pages/EditTestimonials'));
const FAQ = lazy(() => import("./Components/Pages/FAQ"));
const CreateFAQ = lazy(() => import("./Components/Pages/CreateFAQ"));
const EditFAQ = lazy(() => import('./Components/Pages/EditFAQ'));
const OurStaff = lazy(() => import("./Components/Pages/Staff"));
const CreateStaff = lazy(() => import("./Components/Pages/CreateStaff"));
const EditStaff = lazy(() => import('./Components/Pages/EditStaff'));
const Banner = lazy(() => import("./Components/Pages/Banner"));
const CreateBanner = lazy(() => import("./Components/Pages/CreateBanner"));
const EditBanner = lazy(() => import("./Components/Pages/EditBanner"));
const ProductCategory = lazy(() => import("./Components/Pages/ProductCategory"));
const CreateProductCategory = lazy(() => import("./Components/Pages/CreateCategory"));
const EditCategory = lazy(() => import("./Components/Pages/EditCategory"));
const PageContent = lazy(() => import("./Components/Pages/PageContent"));
const CreatePageContent = lazy(() => import("./Components/Pages/CreatePageContent"));
const Product = lazy(() => import("./Components/Pages/Product"));
const CreateProduct = lazy(() => import("./Components/Pages/CreateProduct"));
const EditProduct = lazy(() => import("./Components/Pages/EditProduct"));
const Partner = lazy(() => import("./Components/Pages/Partners"));
const CreatePartner = lazy(() => import("./Components/Pages/CreatePartner"));
const EditPartner = lazy(() => import("./Components/Pages/EditPartner"));
const Dashboard = lazy(() => import("./Components/Pages/Dashboard"));
const Signup = lazy(() => import("./Components/Adminsignup"));
const Login = lazy(() => import("./Components/Adminlogin"));
const VerifyOTP = lazy(() => import("./Components/VerifyOTP"));
const ResetPassword = lazy(() => import("./Components/ResetPassword"));
const EditPageContent = lazy(() => import('./Components/Pages/EditPageContent'));
const ForgetPassword = lazy(() => import('./Components/ForgotPassword'));
const DatabaseManagement = lazy(() => import('./Components/Pages/DatabaseManagement'));
const ManagePassword = lazy(() => import("./Components/Pages/ManagePassword"));
const Logo = lazy(() => import("./Components/Pages/Logo"));
const CreateAboutUsPoints = lazy(() => import('./Components/Pages/CreateAboutuspoints'));
const EditAboutUsPoints = lazy(() => import('./Components/Pages/EditAboutuspoints'));
const Achievements = lazy(() => import("./Components/Pages/Achievements"));
const CreateAchievements = lazy(() => import("./Components/Pages/CreateAchievements"));
const EditAchievement = lazy(() => import('./Components/Pages/EditAchievements'));
const Counter = lazy(() => import("./Components/Pages/Counter"));
const EditCounter = lazy(() => import("./Components/Pages/EditCounter"));
const CreateCounter = lazy(() => import("./Components/Pages/CreateCounter"));
const GalleryCategory = lazy(() => import("./Components/Pages/GalleryCategory"));
const EditGalleryCategory = lazy(() => import("./Components/Pages/EditGalleryCategory"));
const CreateGalleryCategory = lazy(() => import("./Components/Pages/CreateGalleryCategory"));
const Gallery = lazy(() => import("./Components/Pages/Gallery"));
const CreateGallery = lazy(() => import("./Components/Pages/CreateGallery"));
const EditGallery = lazy(() => import("./Components/Pages/EditGallery"));
const Inquiry = lazy(() => import("./Components/Pages/Inquiry"));
const Mission = lazy(() => import("./Components/Pages/Mission"));
const Vision = lazy(() => import("./Components/Pages/Vision"));
const Corevalue = lazy(() => import("./Components/Pages/Corevalue"));
const CreateCorevalue = lazy(() => import("./Components/Pages/CreateCorevalue"));
const EditCorevalue = lazy(() => import("./Components/Pages/EditCorevalue"));
const Aboutcompany = lazy(() => import('./Components/Pages/Aboutcompany'));
const Careeroption = lazy(() => import("./Components/Pages/Careeroptions"));
const CreateCareeroption = lazy(() => import("./Components/Pages/CreateCareeroption"));
const EditCareeroption = lazy(() => import("./Components/Pages/EditCareeroption"));
const Careerinquiry = lazy(() => import("./Components/Pages/Careerinquiry"));
const Footer = lazy(() => import("./Components/Pages/Footer"));
const Header = lazy(() => import("./Components/Pages/Header"));
const Globalpresence = lazy(() => import("./Components/Pages/GlobalPresence"));
const WhatsappSettings = lazy(() => import("./Components/Pages/WhatsappSettings"));
const GoogleSettings = lazy(() => import("./Components/Pages/GoogleSettings"));
const Menulisting = lazy(() => import("./Components/Pages/Menulisting"));
const CreateMenulisting = lazy(() => import("./Components/Pages/CreateMenulisting"));
const EditMenulisting = lazy(() => import("./Components/Pages/EditMenulisting"));
const Infrastructure = lazy(() => import("./Components/Pages/Infrastructure"));
const CreateInfrastructure = lazy(() => import("./Components/Pages/CreateInfrastructure"));
const EditInfrastructure = lazy(() => import("./Components/Pages/EditInfrastructure"));
const QualityControl = lazy(() => import("./Components/Pages/QualityControl"));
const CreateQualityControl = lazy(() => import("./Components/Pages/CreateQualityControl"));
const EditQualityControl = lazy(() => import("./Components/Pages/EditQualityControl"));
const Sitemap = lazy(() => import("./Components/Pages/Sitemap"));
const CreateSitemap = lazy(() => import("./Components/Pages/CreateSitemap"));
const EditSitemap = lazy(() => import("./Components/Pages/EditSitemap"));
const Metadetails = lazy(() => import("./Components/Pages/Metadetails"));
const EditMetadetails = lazy(() => import("./Components/Pages/EditMetadetails"));
const ManageProfile = lazy(() => import("./Components/Pages/ManageProfile"));
const MissionAndVision = lazy(() => import('./Components/Pages/MissionAndVision'));
const Benefits = lazy(() => import("./Components/Pages/Benefits"));
const CreateBenefits = lazy(() => import("./Components/Pages/CreateBenefits"));
const EditBenefits = lazy(() => import("./Components/Pages/EditBenefits"));
const ManageColor = lazy(() => import("./Components/Pages/ManageColor"));
const Navbar = lazy(() => import('./Clientside/components/Navbar'));
const AboutUs = lazy(() => import('./Clientside/components/home/AboutUs'));
const BlogPage = lazy(() => import('./Clientside/pages/BlogPage'));
const Homepage = lazy(() => import("./Clientside/pages/HomePage"));
const ProductPage = lazy(() => import("./Clientside/pages/ProductPage"));
const ContactPage = lazy(() => import("./Clientside/pages/ContactPage"));
const ProductDetailPage = lazy(() => import("./Clientside/pages/ProductDetailPage"));
const Resource = lazy(() => import("./Clientside/pages/Resource"));
const AboutUsPage = lazy(() => import('./Clientside/pages/AboutUs'));
const MyMissionAndVision = lazy(() => import('./Components/Pages/MyMissionandVision'));
const WhyChooseUsTable = lazy(() => import('./Components/Pages/WhyChooseUs'));
const EditWhyChooseUs = lazy(() => import('./Components/Pages/EditWhyChooseUs'));
const CreateWhyChooseUs = lazy(() => import('./Components/Pages/CreateWhyChooseUs'));
const GlobalPresencePage = lazy(() => import('./Clientside/pages/GlobalPresencePage'));
const VideoTable = lazy(() => import('./Components/Pages/Video'));
const VideoForm = lazy(() => import('./Components/Pages/CreateVideo'));
const UpdateVideoForm = lazy(() => import('./Components/Pages/EditVideo'));
const YoutubeBanner = lazy(() => import('./Components/Pages/YoutubeBanner'));
const AddYouTubBanner = lazy(() => import('./Components/Pages/CreateYoutubBanner'));
const UpdateYouTubBanner = lazy(() => import('./Components/Pages/EditYoutubBanner'));
const InfographicsTable = lazy(() => import('./Components/infographic/InfographicTable'));
const InfographicsForm = lazy(() => import('./Components/infographic/InforgraphicForm'));
const OurCapabilityServiceTable = lazy(() => import('./Components/ourCapabilityService/ServiceTable'));
const ServiceForm = lazy(() => import('./Components/ourCapabilityService/ServiceForm'));
const OurProcessTable = lazy(() => import('./Components/ourProcess/ProcessTable'));
const OurProcessForm = lazy(() => import('./Components/ourProcess/ProcessForm'));
const PrivacyPolicy = lazy(() => import('./Clientside/components/privacypolicy/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./Clientside/components/privacypolicy/TermsAndCondition'));

// Loading component
const Loading = () => <div>Loading...</div>;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get('jwt');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Dynamic Favicon Setup
  useEffect(() => {
    const fetchFavicon = async () => {
      try {
        const response = await axios.get('/api/logo'); // No need for 'blob' since we're handling URLs
        const data = response.data;
  console.log(data)
        // Filter to find the favicon
        const faviconData = data.find(item => item.type === 'favicon');
  
        if (faviconData && faviconData.photo) {
          const faviconURL = `/api/logo/download/${faviconData.photo}`; // Adjust path as needed
  
          let favicon = document.querySelector("link[rel~='icon']");
          if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
          }
          favicon.href = faviconURL;
        } else {
          console.warn("Favicon not found in the API response.");
        }
      } catch (error) {
        console.error("Error fetching favicon:", error);
      }
    };
  
    fetchFavicon();
  }, []);

  return (
    <BrowserRouter>
      <AppContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </BrowserRouter>
  );
}

function AppContent({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = Cookies.get('jwt');
    if (token) {
      setIsLoggedIn(true);
      if (['/login', '/signup', '/resetpassword', '/verifyOTP', '/forgetpassword'].includes(location.pathname)) {
        navigate('/dashboard');
      }
    } else {
      setIsLoggedIn(false);
      if (!location.pathname.startsWith('/login') &&
        !location.pathname.startsWith('/signup') &&
        !location.pathname.startsWith('/resetpassword') &&
        !location.pathname.startsWith('/verifyOTP') &&
        !location.pathname.startsWith('/forgetpassword') &&
        !location.pathname.startsWith('/home') &&
        !location.pathname.startsWith('/about-us') &&
        !location.pathname.startsWith('/blog') &&
        !location.pathname.startsWith('/products') &&
        !location.pathname.startsWith('/contact-us') &&
        !location.pathname.startsWith('/resources') &&
        !location.pathname.startsWith('/our-capabilities') &&
        !location.pathname.startsWith('/privacy-policy') &&
        !location.pathname.startsWith('/terms-conditions') &&
        location.pathname !== '/' &&
        !isProductDetailRoute(location.pathname)) {
        navigate('/login');
      }
    }
  }, [navigate, setIsLoggedIn, location.pathname]);

  const isProductDetailRoute = (pathname) => {
    return pathname.split('/').length === 2 && pathname !== '/';
  };

  return (
    <>
      <div className=''>
        <WhatsAppButton />
        <Chatbot />
      </div>
      <ScrollToTop />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/verifyOTP" element={<VerifyOTP />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />

          <Route path="/" element={<Navbar />}>
            <Route index element={<Homepage />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/contact-us" element={<ContactPage />} />
            <Route path="/resources" element={<Resource />} />
            <Route path="/our-capabilities" element={<GlobalPresencePage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/:slug" element={<ProductDetailPage />} />
          </Route>

          {isLoggedIn && (
            <Route element={<Sidebar />}>
              <Route index element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/createServices" element={<CreateService />} />
              <Route path="/services/editServices/:slugs" element={<EditService />} />
              <Route path="/ServiceCategory" element={<ServiceCategory />} />
              <Route path="/ServiceCategory/CreateServiceCategory" element={<CreateServiceCategory />} />
              <Route path="/ServiceCategory/editServiceCategory/:categoryId/:subCategoryId?/:subSubCategoryId?" element={<EditServiceCategory />} />
              <Route path="/whychooseus" element={<WhyChooseUsTable />} />
              <Route path="/whychooseus/createwhychooseus" element={<CreateWhyChooseUs />} />
              <Route path="/whychooseus/editwhychooseus/:id" element={<EditWhyChooseUs />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/createNews" element={<CreateNews />} />
              <Route path="/news/editNews/:slugs" element={<EditNews />} />
              <Route path="/NewsCategory" element={<NewsCategory />} />
              <Route path="/NewsCategory/CreateNewsCategory" element={<CreateNewsCategory />} />
              <Route path="/NewsCategory/editNewsCategory/:categoryId/:subCategoryId?/:subSubCategoryId?" element={<EditNewsCategory />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/testimonials/createTestimonials" element={<CreateTestimonials />} />
              <Route path="/testimonials/editTestimonials/:id" element={<EditTestimonials />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/faq/createFAQ" element={<CreateFAQ />} />
              <Route path="/faq/editFAQ/:id" element={<EditFAQ />} />
              <Route path="/ourTeam" element={<OurStaff />} />
              <Route path="/ourTeam/createTeam" element={<CreateStaff />} />
              <Route path="/ourTeam/editTeam/:id" element={<EditStaff />} />
              <Route path="/banner" element={<Banner />} />
              <Route path="/banner/createBanner" element={<CreateBanner />} />
              <Route path="/banner/editBanner/:id" element={<EditBanner />} />
              <Route path="/ProductCategory" element={<ProductCategory />} />
              <Route path="/ProductCategory/CreateProductCategory" element={<CreateProductCategory />} />
              <Route path="/ProductCategory/editProductCategory/:categoryId/:subCategoryId?/:subSubCategoryId?" element={<EditCategory />} />
              <Route path="/extrapages" element={<PageContent />} />
              <Route path="/extrapages/createextrapages" element={<CreatePageContent />} />
              <Route path="/extrapages/editextrapages/:id" element={<EditPageContent />} />
              <Route path="/pageContent/createPoints" element={<CreateAboutUsPoints />} />
              <Route path="/pageContent/editPoints/:id" element={<EditAboutUsPoints />} />
              <Route path="/product" element={<Product />} />
              <Route path="/product/createProduct" element={<CreateProduct />} />
              <Route path="/product/editProduct/:slugs" element={<EditProduct />} />
              <Route path="/clients" element={<Partner />} />
              <Route path="/clients/createClients" element={<CreatePartner />} />
              <Route path="/clients/editClients/:id" element={<EditPartner />} />
              <Route path="/manageLogo" element={<Logo />} />
              <Route path="/DatabaseManagement" element={<DatabaseManagement />} />
              <Route path="/managePassword" element={<ManagePassword />} />
              <Route path="/manageProfile" element={<ManageProfile />} />
              <Route path="/certificates" element={<Achievements />} />
              <Route path="/certificates/createcertificates" element={<CreateAchievements />} />
              <Route path="/certificates/editcertificates/:id" element={<EditAchievement />} />
              <Route path="/counter" element={<Counter />} />
              <Route path="/counter/editCounter/:id" element={<EditCounter />} />
              <Route path="/counter/createCounter" element={<CreateCounter />} />
              <Route path="/Inquiry" element={<Inquiry />} />
              <Route path="/GalleryCategory" element={<GalleryCategory />} />
              <Route path="/GalleryCategory/editGalleryCategory/:id" element={<EditGalleryCategory />} />
              <Route path="/GalleryCategory/CreateGalleryCategory" element={<CreateGalleryCategory />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gallery/createGallery" element={<CreateGallery />} />
              <Route path="/gallery/EditGallery/:id" element={<EditGallery />} />
              <Route path="/missionandvision" element={<MissionAndVision />} />
              <Route path="/my-missionandvision" element={<MyMissionAndVision />} />
              <Route path="/video" element={<VideoTable />} />
              <Route path="/add-video" element={<VideoForm />} />
              <Route path="/edit-video/:id" element={<UpdateVideoForm />} />
              <Route path="/youtub-banner" element={<YoutubeBanner />} />
              <Route path="/add-youtub-banner" element={<AddYouTubBanner />} />
              <Route path="/edit-youtub-banner/:id" element={<UpdateYouTubBanner />} />
              <Route path="/corevalue" element={<Corevalue />} />
              <Route path="/corevalue/createCorevalue" element={<CreateCorevalue />} />
              <Route path="/corevalue/editCorevalue/:id" element={<EditCorevalue />} />
              <Route path="/aboutcompany" element={<Aboutcompany />} />
              <Route path="/careeroption" element={<Careeroption />} />
              <Route path="/careeroption/createCareerOption" element={<CreateCareeroption />} />
              <Route path="/careeroption/editCareerOption/:id" element={<EditCareeroption />} />
              <Route path="/careerinquiry" element={<Careerinquiry />} />
              <Route path="/footer" element={<Footer />} />
              <Route path="/header" element={<Header />} />
              <Route path="/globalpresence" element={<Globalpresence />} />
              <Route path="/whatsappSettings" element={<WhatsappSettings />} />
              <Route path="/googleSettings" element={<GoogleSettings />} />
              <Route path="/menulisting" element={<Menulisting />} />
              <Route path="/menulisting/createMenulisting" element={<CreateMenulisting />} />
              <Route path="/menulisting/editMenulisting/:id" element={<EditMenulisting />} />
              <Route path="/infrastructure" element={<Infrastructure />} />
              <Route path="/infrastructure/createInfrastructure" element={<CreateInfrastructure />} />
              <Route path="/infrastructure/editInfrastructure/:id" element={<EditInfrastructure />} />
              <Route path="/qualitycontrol" element={<QualityControl />} />
              <Route path="/qualitycontrol/createQualitycontrol" element={<CreateQualityControl />} />
              <Route path="/qualitycontrol/editQualitycontrol/:id" element={<EditQualityControl />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/sitemap/createSitemap" element={<CreateSitemap />} />
              <Route path="/sitemap/editSitemap/:id/:type" element={<EditSitemap />} />
              <Route path="/metadetails" element={<Metadetails />} />
              <Route path="/metadetails/editmetaDetails/:id/:type" element={<EditMetadetails />} />
              <Route path="/benefits" element={<Benefits />} />
              <Route path="/benefits/createBenefits" element={<CreateBenefits />} />
              <Route path="/benefits/editBenefits/:id" element={<EditBenefits />} />
              <Route path="/manageTheme" element={<ManageColor />} />
              <Route path="/infographic-table" element={<InfographicsTable />} />
              <Route path="/infographic-form" element={<InfographicsForm />} />
              <Route path="/edit-infographic-form/:id" element={<InfographicsForm />} />
              <Route path="/capability-service-table" element={<OurCapabilityServiceTable />} />
              <Route path="/capability-form" element={<ServiceForm />} />
              <Route path="/edit-capability-form/:id" element={<ServiceForm />} />
              <Route path="/process-table" element={<OurProcessTable />} />
              <Route path="/process-form" element={<OurProcessForm />} />
              <Route path="/edit-process-form/:id" element={<OurProcessForm />} />
            </Route>
          )}
        </Routes>
      </Suspense>
    </>
  );
}
 
export default App;
