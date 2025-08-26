import{r as d,u as z,b as j,j as e,L as m,O}from"./index-DaCCig_H.js";import{c as i,P as q}from"./phone-BhAh5nVz.js";import{S as A}from"./settings-CcyGEy1X.js";/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=i("House",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=i("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=i("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=i("ShoppingBag",[["path",{d:"M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z",key:"hou9p0"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M16 10a4 4 0 0 1-8 0",key:"1ltviw"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=i("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]]);/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=i("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),X={home:F,phone:q,shopping:U,users:W,info:B,settings:A},_=()=>{const[u,x]=d.useState(!1),[a,M]=d.useState(!1),[g,C]=d.useState([]),[p,I]=d.useState({primary:{photo:"",alt:""},secondary:{photo:"",alt:""}}),f=z();d.useEffect(()=>{const t=j.get("/api/menulisting/getAllMenulisting"),s=j.get("/api/logo");Promise.all([t,s]).then(([r,v])=>{const P=r.data.menuListings.map(n=>({...n,icon:n.icon||L(n.pagename)}));C(P);const c=v.data.find(n=>n.type==="headerColor"),l=v.data.find(n=>n.type==="headerWhite");I({primary:{photo:(c==null?void 0:c.photo)||"",alt:(c==null?void 0:c.alt)||"Primary Logo"},secondary:{photo:(l==null?void 0:l.photo)||"",alt:(l==null?void 0:l.alt)||"Secondary Logo"}})}).catch(r=>{console.error("Error fetching data:",r)});const h=()=>{const r=window.scrollY/window.innerHeight*100;M(r>=20)};return window.addEventListener("scroll",h),()=>window.removeEventListener("scroll",h)},[]);const L=t=>{const s=t.toLowerCase();return s.includes("home")?"home":s.includes("contact")?"phone":s.includes("product")?"shopping":s.includes("about")?"info":s.includes("team")?"users":"settings"},o=f.pathname==="/"||f.pathname==="/home",S=`w-full transition-all duration-300 ${a?"fixed top-0 shadow-lg bg-white":o?"absolute bg-transparent":"absolute bg-white"} z-50`,$=`transition-colors duration-300 font-medium ${a||!o?"text-black hover:text-gray-600":"sm:text-white hover:text-gray-200"}`,E="text-blue-400",y=`transition-colors duration-300 px-6 py-2 rounded-md ${a||!o?"bg-[#1290ca] text-white hover:bg-[#0b2b59]":"bg-white text-black hover:bg-gray-100"}`,H=()=>{const t=o&&a?p.primary:o?p.secondary:p.primary;return{src:`/api/logo/download/${t.photo}`,alt:t.alt}},b=()=>x(!1),k=(t,s=!1)=>{const h=f.pathname===`/${t.pagename.toLowerCase().replace(/\s+/g,"-")}`;return X[t.icon],e.jsx(m,{to:`/${t.pagename.toLowerCase().replace(/\s+/g,"-")}`,className:`${$} ${h?E:""} ${s?"":"lg:text-[15px] md:text-[13px] xl:text-md"} flex items-center gap-2`,onClick:s?b:void 0,children:t.pagename},t._id)},w=H();return e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"w-full bg-[#128fc9] text-white text-center py-3 text-md font-medium",children:"🚧 This website is currently under construction. Some features may not be available. 🚧"}),e.jsx("nav",{className:S,children:e.jsxs("div",{className:"max-w-8xl md:ml-4 mx-auto md:p-1 px-2 py-1 sm:p-5",children:[e.jsxs("div",{className:"flex justify-between items-center lg:gap-28 xl:justify-between md:justify-center w-full py-1 ",children:[e.jsx("div",{className:"flex-shrink-0 flex items-center",children:e.jsx(m,{to:"/home",className:"flex items-center",children:e.jsx("img",{src:w.src,alt:w.alt,className:"h-12 sm:h-14  md:hidden object-contain block xl:block transition-all",style:{position:"relative",zIndex:10}})})}),e.jsxs("div",{className:"hidden md:flex items-center mr-5 space-x-6",children:[g.map(t=>k(t)),e.jsx(m,{to:"/contact-us",className:y,children:"Inquiry"})]}),e.jsx("div",{className:"md:hidden flex items-center",children:e.jsx("button",{onClick:()=>x(!u),className:"focus:outline-none text-black",children:u?e.jsx(N,{className:"h-6 w-6"}):e.jsx(T,{className:`h-6 w-6 ${a?"text-black":o?"text-white":"text-black"}`})})})]}),u&&e.jsxs("div",{className:"md:hidden fixed inset-0 bg-white flex flex-col justify-center z-40",children:[e.jsx("button",{onClick:()=>x(!1),className:"absolute top-4 right-4 text-black focus:outline-none",children:e.jsx(N,{className:"h-6 w-6"})}),e.jsxs("div",{className:"w-full h-full flex flex-col items-center mt-20 space-y-4",children:[g.map(t=>k(t,!0)),e.jsx(m,{to:"/contact-us",className:y,onClick:b,children:e.jsx("p",{className:"font-medium",children:"Inquiry"})})]})]})]})}),e.jsx(O,{})]})};export{_ as default};
