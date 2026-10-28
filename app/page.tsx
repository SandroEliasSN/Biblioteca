'use client';
import {useEffect,useState} from 'react';
type Entry={id:string;snippet?:{title?:string;description?:string}};
type Data={items?:Entry[];nextPageToken?:string;error?:string};
const categories=['Historia','Cultura & Traditio','Sapientia','Ars Culinaria','Linguarum','Litterae & Artes','Scientia & Technica','Otium'];
export default function Home(){
 const [subscriptions,setSubscriptions]=useState<Data|null>(null);
 const [playlists,setPlaylists]=useState<Data|null>(null);
 const [tab,setTab]=useState<'subscriptions'|'playlists'>('subscriptions');
 const [loading,setLoading]=useState(true);
 useEffect(()=>{Promise.all([fetch('/api/youtube/subscriptions').then(r=>r.json()),fetch('/api/youtube/playlists').then(r=>r.json())]).then(([a,b])=>{setSubscriptions(a);setPlaylists(b)}).finally(()=>setLoading(false))},[]);
 const data=tab==='subscriptions'?subscriptions:playlists;
 async function more(){if(!data?.nextPageToken)return;const response:Data=await fetch('/api/youtube/'+tab+'?pageToken='+encodeURIComponent(data.nextPageToken)).then(r=>r.json());const merged={...response,items:[...(data.items||[]),...(response.items||[])]};if(tab==='subscriptions')setSubscriptions(merged);else setPlaylists(merged)}
 return <main style={{maxWidth:950,margin:'auto',padding:32}}><p style={{letterSpacing:4}}>BIBLIOTHECA</p><h1 style={{fontSize:48,fontWeight:400}}>Eine Bibliothek des Wissens.</h1><p>Deine persönliche YouTube-Bibliothek.</p><section style={{display:'flex',flexWrap:'wrap',gap:8,margin:'30px 0'}}>{categories.map((c,i)=><span key={c} style={{border:'1px solid #b5aa97',borderRadius:20,padding:10}}>{i+1}. {c}</span>)}</section>{loading?<p>Lade Bibliothek …</p>:subscriptions?.error==='not_authenticated'?<a href="/api/auth/google" style={{display:'inline-block',background:'#322a21',color:'white',padding:16,borderRadius:8}}>Mit YouTube verbinden</a>:<><nav style={{display:'flex',gap:12}}><button onClick={()=>setTab('subscriptions')}>Abonnements</button><button onClick={()=>setTab('playlists')}>Playlists</button><button onClick={()=>fetch('/api/auth/logout',{method:'POST'}).then(()=>location.reload())}>Abmelden</button></nav>{data?.error?<p>Fehler: {data.error}</p>:<><p>{data?.items?.length||0} Einträge geladen</p><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>{data?.items?.map(e=><article key={e.id} style={{background:'white',borderRadius:10,padding:18}}><strong>{e.snippet?.title}</strong><p>{e.snippet?.description?.slice(0,100)}</p></article>)}</div>{data?.nextPageToken&&<button onClick={more}>Weitere laden</button>}</>}</>}</main>
}