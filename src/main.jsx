import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity, AlertTriangle, Baby, Bell, CalendarCheck, ChevronRight,
  ClipboardList, Cloud, CloudOff, Droplets, HeartPulse, Home, Leaf,
  LogOut, Menu, Pencil, Plus, RefreshCw, Search, Settings, ShieldCheck,
  Syringe, User, Users, X, BarChart3
} from "lucide-react";
import "./styles.css";

const seedChildren = [
  { id:"C001", name:"Ananya Patil", dob:"2023-12-10", gender:"Female", guardian:"Meena Patil", center:"Shivaji Nagar", address:"Shivaji Nagar", status:"Normal", weight:11.2, height:86, muac:14.1, attendance:92, vaccination:"Up to date" },
  { id:"C002", name:"Rohan Yadav", dob:"2023-07-12", gender:"Male", guardian:"Raj Yadav", center:"Shivaji Nagar", address:"Shivaji Nagar", status:"Moderate", weight:10.1, height:83, muac:12.7, attendance:86, vaccination:"Due" },
  { id:"C003", name:"Pooja Singh", dob:"2023-02-22", gender:"Female", guardian:"Sunita Singh", center:"Shivaji Nagar", address:"Shivaji Nagar", status:"Severe", weight:8.9, height:80, muac:11.1, attendance:71, vaccination:"Pending" },
  { id:"C004", name:"Aarav Sharma", dob:"2023-08-03", gender:"Male", guardian:"Neha Sharma", center:"Shivaji Nagar", address:"Shivaji Nagar", status:"Normal", weight:11.7, height:87, muac:14.4, attendance:95, vaccination:"Up to date" }
];

const navItems = [
  ["dashboard","Dashboard",Home], ["children","Children",Baby], ["growth","Growth",Activity],
  ["nutrition","Nutrition",Leaf], ["health","Health",Syringe], ["alerts","Alerts",Bell],
  ["attendance","Attendance",CalendarCheck], ["reports","Reports",BarChart3],
  ["sync","Data Sync",RefreshCw], ["settings","Settings",Settings]
];

function App() {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem("angancare_logged_in") === "1");
  const [page, setPage] = useState("dashboard");
  const [user, setUser] = useState({name:"Asha More", role:"Anganwadi Worker", center:"Shivaji Nagar"});
  const [children, setChildren] = useState(() => {
    try { return JSON.parse(localStorage.getItem("angancare_children")) || seedChildren; } catch { return seedChildren; }
  });
  const [selectedChild, setSelectedChild] = useState(null);
  const [toast, setToast] = useState("");

  const saveChildren = next => {
    setChildren(next);
    localStorage.setItem("angancare_children", JSON.stringify(next));
  };
  const notify = msg => { setToast(msg); setTimeout(()=>setToast(""), 2200); };
  const logout = () => { localStorage.removeItem("angancare_logged_in"); setLoggedIn(false); };

  if (!loggedIn) return <Login onSuccess={(u)=>{setUser(u);localStorage.setItem("angancare_logged_in","1");setLoggedIn(true);}} />;

  const openChild = c => { setSelectedChild(c); setPage("child-details"); };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">A</div><div><b>ANGANCARE</b><small>Health & Growth</small></div></div>
        <div className="center-pill"><span className="dot"></span>{user.center}</div>
        <nav>{navItems.map(([id,label,Icon]) =>
          <button key={id} className={page===id ? "nav-item active":"nav-item"} onClick={()=>setPage(id)}>
            <Icon size={18}/><span>{label}</span>
          </button>
        )}</nav>
        <button className="logout" onClick={logout}><LogOut size={18}/> Logout</button>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile-menu" onClick={()=>document.body.classList.toggle("sidebar-open")}><Menu/></button>
          <div><h1>{pageTitle(page)}</h1><p>{pageSubtitle(page)}</p></div>
          <div className="top-actions"><span className="online"><span className="dot"></span> Online</span><button className="icon-btn" onClick={()=>setPage("alerts")}><Bell size={19}/><i>3</i></button><div className="user-chip"><div className="avatar">{user.name[0]}</div><span>{user.name}</span></div></div>
        </header>

        <section className="content">
          {page==="dashboard" && <Dashboard children={children} go={setPage} />}
          {page==="children" && <ChildrenPage children={children} saveChildren={saveChildren} openChild={openChild} notify={notify}/>}
          {page==="child-details" && selectedChild && <ChildDetails child={selectedChild} back={()=>setPage("children")} />}
          {page==="growth" && <GrowthPage children={children} openChild={openChild}/>}
          {page==="nutrition" && <NutritionPage children={children}/>}
          {page==="health" && <HealthPage children={children}/>}
          {page==="alerts" && <AlertsPage children={children}/>}
          {page==="attendance" && <AttendancePage children={children}/>}
          {page==="reports" && <ReportsPage children={children}/>}
          {page==="sync" && <SyncPage notify={notify}/>}
          {page==="settings" && <SettingsPage user={user} setUser={setUser} notify={notify}/>}
        </section>
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function pageTitle(p) {
  return {dashboard:"Dashboard",children:"Child Management","child-details":"Child Details",growth:"Growth Monitoring",nutrition:"Nutrition Management",health:"Health & Vaccination",alerts:"Alerts & Notifications",attendance:"Attendance Management",reports:"Reports & Dashboard",sync:"Data Sync & Offline Support",settings:"Settings & Master Data"}[p];
}
function pageSubtitle(p) {
  return {dashboard:"Good morning, Asha. Here is today's overview.",children:"Manage registered children and their profiles","child-details":"Complete health and growth profile",growth:"Track measurements and growth status",nutrition:"Daily meals, supplements and nutrition status",health:"Vaccination and health checkup records",alerts:"Important reminders and child alerts",attendance:"Daily attendance marking and history",reports:"Growth, nutrition and health summary",sync:"Monitor local data and synchronization",settings:"Profile, center, roles and application settings"}[p];
}

function Login({onSuccess}) {
  const [mobile,setMobile]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState("");
  return <div className="login-page">
    <div className="login-art"><div className="house">♥</div><h1>ANGANCARE</h1><p>Digital Health, Nutrition & Growth Monitoring</p><p>for Anganwadi Children</p><div className="login-illustration"><Baby size={90}/><HeartPulse size={50}/></div></div>
    <form className="login-card" onSubmit={e=>{e.preventDefault(); if(mobile && password){onSuccess({name:"Asha More",role:"Anganwadi Worker",center:"Shivaji Nagar"});} else setError("Enter mobile number and password.");}}>
      <h2>Welcome back</h2><p className="muted">Sign in to your Anganwadi workspace</p>
      <label>Username / Mobile</label><input value={mobile} onChange={e=>setMobile(e.target.value)} placeholder="Enter mobile number"/>
      <label>Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password"/>
      {error && <div className="error">{error}</div>}<button className="primary full">LOGIN</button>
      <button type="button" className="link-btn">Forgot Password?</button>
      <small className="demo">Demo: any non-empty mobile + password</small>
    </form>
  </div>;
}

function Dashboard({children,go}) {
  const stats = {
    total:children.length,
    normal:children.filter(c=>c.status==="Normal").length,
    moderate:children.filter(c=>c.status==="Moderate").length,
    severe:children.filter(c=>c.status==="Severe").length
  };
  return <>
    <div className="welcome-card"><div><span className="eyebrow">TODAY'S OVERVIEW</span><h2>Healthy children, stronger communities.</h2><p>Keep every child's growth, nutrition and health record up to date.</p></div><button className="primary" onClick={()=>go("children")}><Plus size={18}/> Add Child</button></div>
    <div className="stats-grid">
      <Stat title="Total Children" value={stats.total} icon={Users} tone="pink"/>
      <Stat title="Normal" value={stats.normal} icon={ShieldCheck} tone="green"/>
      <Stat title="Moderate" value={stats.moderate} icon={AlertTriangle} tone="orange"/>
      <Stat title="Severe" value={stats.severe} icon={HeartPulse} tone="red"/>
    </div>
    <div className="two-col">
      <Panel title="Upcoming Reminders" action="View all" onAction={()=>go("alerts")}>
        <Reminder icon={Syringe} title="Vaccination Due" text="3 children need vaccination" tone="orange"/>
        <Reminder icon={HeartPulse} title="Health Checkup Due" text="5 children need checkup" tone="blue"/>
        <Reminder icon={CalendarCheck} title="Attendance Follow-up" text="4 children have low attendance" tone="purple"/>
      </Panel>
      <Panel title="Growth Overview" action="Open growth" onAction={()=>go("growth")}>
        <div className="bar-row"><span>Normal</span><b>{stats.normal}</b><div><i style={{width:`${Math.max(4,stats.normal/(stats.total||1)*100)}%`}}></i></div></div>
        <div className="bar-row"><span>Moderate</span><b>{stats.moderate}</b><div><i style={{width:`${Math.max(4,stats.moderate/(stats.total||1)*100)}%`}}></i></div></div>
        <div className="bar-row"><span>Severe</span><b>{stats.severe}</b><div><i style={{width:`${Math.max(4,stats.severe/(stats.total||1)*100)}%`}}></i></div></div>
      </Panel>
    </div>
    <Panel title="Recent Children">
      <div className="table-wrap"><table><thead><tr><th>Child</th><th>Gender</th><th>Growth</th><th>Weight</th><th></th></tr></thead><tbody>{children.map(c=><tr key={c.id}><td><b>{c.name}</b><small>{c.id}</small></td><td>{c.gender}</td><td><Status value={c.status}/></td><td>{c.weight} kg</td><td><button className="table-btn" onClick={()=>go("children")}>View <ChevronRight size={15}/></button></td></tr>)}</tbody></table></div>
    </Panel>
  </>;
}
function Stat({title,value,icon:Icon,tone}) { return <div className={`stat-card ${tone}`}><div className="stat-icon"><Icon size={21}/></div><div><span>{title}</span><strong>{value}</strong></div></div>; }
function Reminder({icon:Icon,title,text,tone}) { return <div className="reminder"><div className={`reminder-icon ${tone}`}><Icon size={20}/></div><div><b>{title}</b><p>{text}</p></div><ChevronRight size={18} className="push"/></div>; }
function Panel({title,action,onAction,children}) { return <div className="panel"><div className="panel-head"><h3>{title}</h3>{action&&<button className="text-btn" onClick={onAction}>{action} <ChevronRight size={15}/></button>}</div>{children}</div>; }
function Status({value}) { return <span className={`status ${value.toLowerCase()}`}>{value}</span>; }

function ChildrenPage({children,saveChildren,openChild,notify}) {
  const [q,setQ]=useState(""); const [show,setShow]=useState(false);
  const filtered=children.filter(c=>c.name.toLowerCase().includes(q.toLowerCase())||c.id.toLowerCase().includes(q.toLowerCase()));
  return <><div className="page-actions"><div className="search"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search child..."/></div><button className="primary" onClick={()=>setShow(true)}><Plus size={18}/> Add Child</button></div>
    <Panel title={`${filtered.length} Registered Children`}><div className="child-grid">{filtered.map(c=><div className="child-card" key={c.id} onClick={()=>openChild(c)}><div className="child-avatar">{c.name.split(" ").map(x=>x[0]).join("").slice(0,2)}</div><div className="child-info"><h3>{c.name}</h3><p>{age(c.dob)} • {c.gender}</p><small>Guardian: {c.guardian}</small><div><Status value={c.status}/><span className="mini-meta">{c.weight} kg • {c.height} cm</span></div></div><ChevronRight/></div>)}</div></Panel>
    {show&&<AddChildModal close={()=>setShow(false)} add={c=>{saveChildren([...children,c]);setShow(false);notify("Child added successfully");}}/>}
  </>;
}

function AddChildModal({close,add}) {
  const [f,setF]=useState({name:"",dob:"",gender:"Female",guardian:"",center:"Shivaji Nagar",address:"",status:"Normal",weight:"",height:"",muac:""});
  const set=(k,v)=>setF({...f,[k]:v});
  return <Modal title="Register New Child" close={close}><div className="form-grid">
    <Field label="Child Name"><input value={f.name} onChange={e=>set("name",e.target.value)} placeholder="Full name"/></Field>
    <Field label="Date of Birth"><input type="date" value={f.dob} onChange={e=>set("dob",e.target.value)}/></Field>
    <Field label="Gender"><select value={f.gender} onChange={e=>set("gender",e.target.value)}><option>Female</option><option>Male</option></select></Field>
    <Field label="Guardian Name"><input value={f.guardian} onChange={e=>set("guardian",e.target.value)} placeholder="Guardian"/></Field>
    <Field label="Anganwadi Center"><input value={f.center} onChange={e=>set("center",e.target.value)}/></Field>
    <Field label="Address"><input value={f.address} onChange={e=>set("address",e.target.value)} placeholder="Address"/></Field>
    <Field label="Weight (kg)"><input type="number" value={f.weight} onChange={e=>set("weight",e.target.value)}/></Field>
    <Field label="Height (cm)"><input type="number" value={f.height} onChange={e=>set("height",e.target.value)}/></Field>
    <Field label="MUAC (cm)"><input type="number" value={f.muac} onChange={e=>set("muac",e.target.value)}/></Field>
  </div><div className="modal-actions"><button className="secondary" onClick={close}>Cancel</button><button className="primary" onClick={()=>f.name&&add({...f,id:"C"+String(Date.now()).slice(-5),weight:Number(f.weight)||0,height:Number(f.height)||0,muac:Number(f.muac)||0,attendance:100,vaccination:"Pending"})}>Save Child</button></div></Modal>;
}

function ChildDetails({child,back}) {
  return <><button className="back-btn" onClick={back}>← Back to Children</button><div className="profile-header"><div className="big-avatar">{child.name[0]}</div><div><h2>{child.name}</h2><p>{age(child.dob)} • {child.gender} • {child.id}</p><Status value={child.status}/></div><button className="secondary push"><Pencil size={16}/> Edit Profile</button></div>
    <div className="stats-grid three"><Stat title="Weight" value={`${child.weight} kg`} icon={Activity} tone="pink"/><Stat title="Height" value={`${child.height} cm`} icon={Activity} tone="blue"/><Stat title="MUAC" value={`${child.muac} cm`} icon={HeartPulse} tone="green"/></div>
    <div className="two-col"><Panel title="Basic Details"><Info label="Guardian" value={child.guardian}/><Info label="Center" value={child.center}/><Info label="Address" value={child.address}/></Panel><Panel title="Health Snapshot"><Info label="Vaccination" value={child.vaccination}/><Info label="Attendance" value={`${child.attendance}%`}/><Info label="Growth status" value={child.status}/></Panel></div>
  </>;
}
function Info({label,value}) { return <div className="info-row"><span>{label}</span><b>{value}</b></div>; }
function Field({label,children}) { return <label className="field">{label}{children}</label>; }
function Modal({title,close,children}) { return <div className="modal-backdrop"><div className="modal"><div className="modal-head"><h2>{title}</h2><button onClick={close}><X/></button></div>{children}</div></div>; }

function GrowthPage({children,openChild}) {
  return <Panel title="Growth Monitoring"><div className="table-wrap"><table><thead><tr><th>Child</th><th>Weight</th><th>Height</th><th>MUAC</th><th>Status</th><th>Action</th></tr></thead><tbody>{children.map(c=><tr key={c.id}><td><b>{c.name}</b><small>{age(c.dob)}</small></td><td>{c.weight} kg</td><td>{c.height} cm</td><td>{c.muac} cm</td><td><Status value={c.status}/></td><td><button className="table-btn" onClick={()=>openChild(c)}>Details <ChevronRight size={14}/></button></td></tr>)}</tbody></table></div></Panel>;
}
function NutritionPage({children}) { return <div className="two-col"><Panel title="Today's Meal"><Meal icon="🍲" name="Breakfast" food="Poha + milk"/><Meal icon="🍛" name="Lunch" food="Khichdi + vegetables"/><Meal icon="🥚" name="Supplement" food="Boiled egg"/></Panel><Panel title="Nutrition Status"><div className="nutrition-score">Good <small>Most children are receiving recommended meals.</small></div>{children.map(c=><div className="simple-list" key={c.id}><span>{c.name}</span><Status value={c.status}/></div>)}</Panel></div>; }
function Meal({icon,name,food}) { return <div className="meal"><span>{icon}</span><div><b>{name}</b><p>{food}</p></div><ChevronRight className="push"/></div>; }
function HealthPage({children}) { return <div className="two-col"><Panel title="Vaccination Schedule">{children.map(c=><div className="simple-list" key={c.id}><div><b>{c.name}</b><small>Next scheduled check</small></div><span className={`vax ${c.vaccination==="Up to date"?"done":""}`}>{c.vaccination}</span></div>)}</Panel><Panel title="Health Checkups"><Info label="Last clinic visit" value="05 Aug 2026"/><Info label="Next checkup" value="05 Sep 2026"/><Info label="Children due" value="5"/></Panel></div>; }
function AlertsPage({children}) { const alerts=[["Vaccination Due","3 children need vaccination","today","orange"],["Health Checkup Due","5 children need checkup","today","blue"],["Growth Alert","2 children need close monitoring","yesterday","red"],["Absent Alert","4 children have low attendance","today","purple"]]; return <div className="alert-list">{alerts.map(([t,d,time,tone])=><div className="alert-card" key={t}><div className={`reminder-icon ${tone}`}><Bell/></div><div><h3>{t}</h3><p>{d}</p><small>{time}</small></div><button className="secondary">View</button></div>)}</div>; }
function AttendancePage({children}) { const [marked,setMarked]=useState({}); return <Panel title="Today's Attendance"><div className="attendance-head"><span>01 September 2026</span><span>{Object.values(marked).filter(Boolean).length}/{children.length} Present</span></div>{children.map(c=><div className="attendance-row" key={c.id}><div className="child-avatar small">{c.name[0]}</div><div><b>{c.name}</b><small>{c.id}</small></div><button className={marked[c.id]?"attendance present":"attendance"} onClick={()=>setMarked({...marked,[c.id]:!marked[c.id]})}>{marked[c.id]?"Present":"Mark Present"}</button></div>)}</Panel>; }
function ReportsPage({children}) { const normal=children.filter(c=>c.status==="Normal").length, moderate=children.filter(c=>c.status==="Moderate").length, severe=children.filter(c=>c.status==="Severe").length; return <><div className="stats-grid"><Stat title="Total Children" value={children.length} icon={Users} tone="pink"/><Stat title="Normal Growth" value={normal} icon={ShieldCheck} tone="green"/><Stat title="Moderate" value={moderate} icon={AlertTriangle} tone="orange"/><Stat title="Severe" value={severe} icon={HeartPulse} tone="red"/></div><Panel title="Monthly Growth Summary"><div className="report-chart">{[normal,moderate,severe].map((v,i)=><div className="report-col" key={i}><div className="column" style={{height:`${Math.max(12,v*20)}px`}}></div><span>{["Normal","Moderate","Severe"][i]}</span><b>{v}</b></div>)}</div></Panel></>; }
function SyncPage({notify}) { const [online,setOnline]=useState(true); return <div className="two-col"><Panel title="Connection Status"><div className="sync-status">{online?<Cloud size={40}/>:<CloudOff size={40}/>}<h2>{online?"Online":"Offline"}</h2><p>{online?"All changes can be synchronized.":"Working from local device storage."}</p><button className="primary" onClick={()=>{setOnline(!online);notify(online?"Offline mode enabled":"Connection restored")}}>{online?"Simulate Offline":"Go Online"}</button></div></Panel><Panel title="Synchronization"><Info label="Last sync" value="01 Sep 2026, 12:08 AM"/><Info label="Pending changes" value="0 records"/><Info label="Local records" value="4 children"/><button className="secondary full" onClick={()=>notify("Synchronization completed")}>Sync Now</button></Panel></div>; }
function SettingsPage({user,setUser,notify}) { const [name,setName]=useState(user.name); return <div className="two-col"><Panel title="Profile"><Field label="Worker Name"><input value={name} onChange={e=>setName(e.target.value)}/></Field><Field label="Role"><input value={user.role} disabled/></Field><Field label="Anganwadi Center"><input value={user.center} disabled/></Field><button className="primary" onClick={()=>{setUser({...user,name});notify("Profile updated")}}>Save Changes</button></Panel><Panel title="Master Data"><Info label="Language" value="English"/><Info label="Health check types" value="6 configured"/><Info label="Food items" value="24 configured"/><Info label="App version" value="1.0.0"/></Panel></div>; }

function age(dob) { if(!dob)return "Age not set"; const d=new Date(dob), n=new Date(); let y=n.getFullYear()-d.getFullYear(), m=n.getMonth()-d.getMonth(); if(m<0){y--;m+=12;} return `${y} Y ${m} M`; }

const root=createRoot(document.getElementById("root")); root.render(<App/>);
