import React, { useEffect } from 'react'
import Header from '../header/header'
import { useDispatch, useSelector } from 'react-redux'
import { hideLoader } from '../../../features/loader/loaderSlice'
import Footer from '../footer/footer'

export default function About() {
  const dispatch = useDispatch()
  const loaderState = useSelector(state=> state?.loader?.value)

  useEffect(()=>{
      dispatch(hideLoader)
  },[])
  return (
    <>
    <div className='nk-body'>
      <div className='nk-body-root'>
    {loaderState && <div className="preloader">
        <div className="loader"></div>
      </div>}

    <Header/>
    <main className="nk-pages">
            <section className="nk-section pt-120 pt-lg-160">
                <div className="nk-mask blur-1 left center"></div>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-7">
                            <div className="nk-section-head text-center"><span className="nk-section-subtitle" data-aos="fade-up" data-aos-delay="0">Our Story</span>
                                <h2 className="nk-section-title" data-aos="fade-up" data-aos-delay="50">The Story Behind NioLand</h2>
                                <p className="nk-section-text" data-aos="fade-up" data-aos-delay="100"> Discover the inspiring story behind NioLand - how a vision became a reality, empowering individuals and businesses to thrive in the digital world. </p>
                                <ul className="nk-btn-group justify-content-center pt-5">
                                    <li data-aos="fade-up" data-aos-delay="150"><a href="signup.html" className="btn btn-lg btn-primary">Join Our Team</a></li>
                                    <li data-aos="fade-up" data-aos-delay="200"><a href="#" className="btn  btn-lg btn-outline-primary">Our Values</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-xl-8">
                            <div className="nk-video rounded-4 bg-primary-100 " data-aos="fade-up" data-aos-delay="300">
                                <div className="nk-mask shape-1 rounded-4 overflow-hidden" data-aos="fade-in" data-aos-delay="350"></div>
                                <div className="nk-video-inner">
                                    <div className="nk-video-logo p-4">
                                        <a href="index.html" className="logo-link">
                                            <div className="logo-wrap"><img className="logo-img" src="images/logo-s1-dark.png" srcset="https://nioland.themenio.com/images/logo-s1-dark2x.png 2x" alt="brand-logo"/></div>
                                        </a>
                                    </div>
                                    <div className="nk-video-content">
                                        <div className="nk-video-img"><img src="images/video/e.png" alt="video" data-aos="fade-up" data-aos-delay="400"/></div>
                                        <div className="nk-video-btn"><a data-fslightbox href="https://www.youtube.com/watch?v=pVE92TNDwUk" className="media media-lg media-middle media-circle text-bg-primary shadow-xl animate animate-infinite animate-pulse animate-duration-1"><em className="icon ni ni-play-fill"></em></a></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="nk-section">
                <div className="container">
                    <div className="row gy-5">
                        <div className="col-md-6" data-aos="fade-up" data-aos-delay="0">
                            <div className="card">
                                <div className="card-body">
                                    <div className="media-group gap-3 gap-md-4 flex-column flex-lg-row align-items-start align-items-lg-center">
                                        <div className="media-text">
                                            <div className="h1 text-primary">240%</div>
                                        </div>
                                        <div className="media-text m-0">
                                            <h4 className="text-capitalize">Company growth</h4>
                                            <p> Unleashing exponential growth through innovation. </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6" data-aos="fade-up" data-aos-delay="50">
                            <div className="card">
                                <div className="card-body">
                                    <div className="media-group gap-3 gap-md-4 flex-column flex-lg-row align-items-start align-items-lg-center">
                                        <div className="media-text">
                                            <div className="h1 text-warning">175+</div>
                                        </div>
                                        <div className="media-text m-0">
                                            <h4 className="text-capitalize">Team members</h4>
                                            <p> Our talented team members are the driving force behind. </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6" data-aos="fade-up" data-aos-delay="100">
                            <div className="card">
                                <div className="card-body">
                                    <div className="media-group gap-3 gap-md-4 flex-column flex-lg-row align-items-start align-items-lg-center">
                                        <div className="media-text">
                                            <div className="h1 text-danger">625+</div>
                                        </div>
                                        <div className="media-text m-0">
                                            <h4 className="text-capitalize">Active projects</h4>
                                            <p> We have a diverse range of active projects that are driving. </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6" data-aos="fade-up" data-aos-delay="150">
                            <div className="card">
                                <div className="card-body">
                                    <div className="media-group gap-3 gap-md-4 flex-column flex-lg-row align-items-start align-items-lg-center">
                                        <div className="media-text">
                                            <div className="h1 text-success">99%</div>
                                        </div>
                                        <div className="media-text m-0">
                                            <h4 className="text-capitalize">Customer satisfaction</h4>
                                            <p> Customer Satisfaction is our top priority. </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="nk-section">
                <div className="container">
                    <div className="row align-items-lg-end justify-content-lg-between gy-5 ">
                        <div className="col-lg-6">
                            <div className="d-flex flex-column" data-aos="fade-up" data-aos-delay="300">
                                <div className="nk-frame mb-5"><img src="images/cover/cover-37.png" alt="cover-bg"/></div>
                                <div className="nk-section-head pb-0"><span className="nk-section-subtitle">The journey</span>
                                    <h2 className="nk-section-title">Journey Towards Success</h2>
                                    <p className="nk-section-text"> The journey towards success for NioLand has been a remarkable one. It started with a vision to provide businesses with a comprehensive platform that simplifies collaboration and maximizes productivity. With a dedicated
                                        team and a customer-centric approach, NioLand has continuously evolved and improved its offerings to meet the changing needs of businesses. </p>
                                    <ul className="nk-btn-group pt-5">
                                        <li><a href="signup.html" className="btn btn-primary">Join Our Team</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-xl-5">
                            <div className="d-flex flex-column">
                                <div className="nk-frame mb-5 mb-lg-0 order-lg-2 mt-lg-3" data-aos="fade-up" data-aos-delay="400"><img src="images/cover/cover-38.png" alt="cover-bg"/></div>
                                <div className="nk-section-head pb-0"><span className="nk-section-subtitle">Behind the story</span>
                                    <h2 className="nk-section-title">How NioLand Started</h2>
                                    <p className="nk-section-text"> NioLand started with a vision to revolutionize the way businesses connect and collaborate. It was founded by a group of passionate individuals who saw the need for a platform that seamlessly integrates different tools
                                        and channels, allowing teams to work together more effectively. </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="nk-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-xxl-6">
                            <div className="nk-section-head text-center"><span className="nk-section-subtitle">our values</span>
                                <div>
                                    <h2 className="nk-section-title">Core Values we define</h2>
                                    <p className="nk-section-text">Innovation, Collaboration, Excellence. These core values guide us as we strive to deliver exceptional solutions and empower businesses.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row gy-5">
                        <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="0">
                            <div className="card">
                                <div className="card-body">
                                    <div className="media media-lg media-middle media-circle text-bg-primary-soft mb-4"><em className="icon ni ni-file-text-fill"></em></div>
                                    <h5>Result Matter</h5>
                                    <p className="text line-clamp-2"> At NioLand, we believe that results matter. We are committed to delivering tangible outcomes and measurable impact for our clients. </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="50">
                            <div className="card">
                                <div className="card-body">
                                    <div className="media media-lg media-middle media-circle text-bg-info-soft mb-4"><em className="icon ni ni-gift"></em></div>
                                    <h5>Commitment</h5>
                                    <p className="text line-clamp-2">Commitment is one of our core values at NioLand. We are dedicated to providing exceptional service</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="100">
                            <div className="card">
                                <div className="card-body">
                                    <div className="media media-lg media-middle media-circle text-bg-warning-soft mb-4"><em className="icon ni ni-growth-fill"></em></div>
                                    <h5>Growth</h5>
                                    <p className="text line-clamp-2"> Growth is a fundamental value at NioLand. We believe in continuously learning, improving, and expanding our capabilities. </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="0">
                            <div className="card">
                                <div className="card-body">
                                    <div className="media media-lg media-middle media-circle text-bg-danger-soft mb-4"><em className="icon ni ni-users-fill"></em></div>
                                    <h5>Team Work</h5>
                                    <p className="text line-clamp-2"> Teamwork is a core value at NioLand. We believe in the power of collaboration and synergy that comes from working together. </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="50">
                            <div className="card">
                                <div className="card-body">
                                    <div className="media media-lg media-middle media-circle text-bg-primary-soft mb-4"><em className="icon ni ni-bulb-fill"></em></div>
                                    <h5>Innovation</h5>
                                    <p className="text line-clamp-2"> Innovation is at the heart of NioLand. We continuously strive to push boundaries and challenge the status quo. </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="100">
                            <div className="card">
                                <div className="card-body">
                                    <div className="media media-lg media-middle media-circle text-bg-success-soft mb-4"><em className="icon ni ni-flag-fill"></em></div>
                                    <h5>Ownership</h5>
                                    <p className="text line-clamp-2"> Ownership is a core value at NioLand. We believe in taking responsibility for our actions, projects, and outcomes. </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="nk-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-xxl-6">
                            <div className="nk-section-head text-center"><span className="nk-section-subtitle">team members</span>
                                <h2 className="nk-section-title">The Team Behind NioLand</h2>
                                <p className="nk-section-text">Meet the dedicated team behind NioLand, working tirelessly to bring you the best experience.</p>
                                <ul className="nk-btn-group justify-content-center pt-5">
                                    <li><a href="signup.html" className="btn btn-primary btn-lg">Join Our Team</a></li>
                                    <li><a href="#" className="btn btn-outline-primary btn-lg">Learn More</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="row gy-5">
                        <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="0">
                            <div className="card border-0 bg-blue-300">
                                <div className="card-body pb-0">
                                    <div className="card-title-group align-items-start mb-4">
                                        <div className="card-title-group-item">
                                            <h4 className="text-capitalize mb-1">John Carter</h4>
                                            <p className="fs-16">CEO &amp; Founder</p>
                                        </div>
                                        <div className="card-title-group-item"><a href="#" className="text-dark"><em className="icon icon-lg ni ni-fedora"></em></a></div>
                                    </div>
                                    <div className="card-image text-center"><img src="images/team/a.png" alt="team" data-aos="fade-up" data-aos-delay="50"/></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="50">
                            <div className="card border-0 bg-green-50">
                                <div className="card-body pb-0">
                                    <div className="card-title-group align-items-start mb-4">
                                        <div className="card-title-group-item">
                                            <h4 className="text-capitalize mb-1">Sophie Moor</h4>
                                            <p className="fs-16"> Manager Of XYZ</p>
                                        </div>
                                        <div className="card-title-group-item"><a href="#" className="text-dark"><em className="icon icon-lg ni ni-b-si"></em></a></div>
                                    </div>
                                    <div className="card-image text-center"><img src="images/team/b.png" alt="team" data-aos="fade-up" data-aos-delay="100"/></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="100">
                            <div className="card border-0 bg-yellow-50">
                                <div className="card-body pb-0">
                                    <div className="card-title-group align-items-start mb-4">
                                        <div className="card-title-group-item">
                                            <h4 className="text-capitalize mb-1">Sam Houston</h4>
                                            <p className="fs-16">VP of Development</p>
                                        </div>
                                        <div className="card-title-group-item"><a href="#" className="text-dark"><em className="icon icon-lg ni ni-linkedin-round"></em></a></div>
                                    </div>
                                    <div className="card-image text-center"><img src="images/team/c.png" alt="team" data-aos="fade-up" data-aos-delay="150"/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="nk-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-xxl-6">
                            <div className="nk-section-head text-center"><span className="nk-section-subtitle">support From</span>
                                <h2 className="nk-section-title">Our Investors</h2>
                                <p className="nk-section-text">We are proud to have the support of our valued investors who believe in our vision and contribute to our growth.</p>
                            </div>
                        </div>
                    </div>
                    <div className="row gap g-3 justify-content-xl-center">
                        <div className="col-6 col-sm-4 col-lg-3 col-xl-2"><a href="#" className="nk-brand bg-gray border border-gray-50 py-3 py-md-4 px-5 px-md-6 rounded-2 text-center d-inline-block w-100 h-100" data-aos="fade-up" data-aos-delay="50"><img src="images/brands/a.png" alt="brand" className="img-fluid"/></a></div>
                        <div
                            className="col-6 col-sm-4 col-lg-3 col-xl-2"><a href="#" className="nk-brand bg-gray border border-gray-50 py-3 py-md-4 px-5 px-md-6 rounded-2 text-center d-inline-block w-100 h-100" data-aos="fade-up" data-aos-delay="100"><img src="images/brands/b.png" alt="brand" className="img-fluid"/></a></div>
                    <div
                        className="col-6 col-sm-4 col-lg-3 col-xl-2"><a href="#" className="nk-brand bg-gray border border-gray-50 py-3 py-md-4 px-5 px-md-6 rounded-2 text-center d-inline-block w-100 h-100" data-aos="fade-up" data-aos-delay="150"><img src="images/brands/c.png" alt="brand" className="img-fluid"/></a></div>
                <div
                    className="col-6 col-sm-4 col-lg-3 col-xl-2"><a href="#" className="nk-brand bg-gray border border-gray-50 py-3 py-md-4 px-5 px-md-6 rounded-2 text-center d-inline-block w-100 h-100" data-aos="fade-up" data-aos-delay="200"><img src="images/brands/d.png" alt="brand" className="img-fluid"/></a></div>
    <div
        className="col-6 col-sm-4 col-lg-3 col-xl-2"><a href="#" className="nk-brand bg-gray border border-gray-50 py-3 py-md-4 px-5 px-md-6 rounded-2 text-center d-inline-block w-100 h-100" data-aos="fade-up" data-aos-delay="250"><img src="images/brands/e.png" alt="brand" className="img-fluid"/></a></div>
        </div>
        </div>
        </section>
        <section className="nk-section">
            <div className="nk-mask blur-1 right center"></div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-xxl-6">
                        <div className="nk-section-head text-center"><span className="nk-section-subtitle">Press &amp; Media</span>
                            <h2 className="nk-section-title">NioLand In The News</h2>
                            <p className="nk-section-text">Discover the latest news and updates about NioLand, featured in top publications and media outlets.</p>
                        </div>
                    </div>
                </div>
                <div className="row gy-5">
                    <div className="col-lg-6">
                        <div className="card card-gutter-lg bg-primary is-theme h-100" data-aos="fade-up" data-aos-delay="0">
                            <div className="card-body p-5 p-md-7">
                                <div className="card-content h-100 d-flex flex-column justify-content-between">
                                    <div className="card-image mb-3"><a href="#"><img src="images/brands/a-light.png" alt="brand" className="h-24px"/></a></div>
                                    <h3 className="card-title text-capitalize"> NioLand raises $84M in Series C funding </h3>
                                    <p> NioLand, a rapidly growing technology company, recently announced the successful completion of its Series C funding round, securing a substantial investment of $84 million. <br/><br/> The funding will be utilized to further
                                        enhance and expand NioLand's products and services, solidifying its position as a market leader in the industry. The significant investment highlights the confidence and support from investors in NioLand's vision
                                        and potential for continued success. </p>
                                    <div><a href="blog-single.html" className="btn-link"><span>Read More</span><em className="icon ni ni-arrow-right"></em></a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="row gy-5">
                            <div className="col-12">
                                <div className="card card-gutter-md bg-blue-1400 is-theme" data-aos="fade-up" data-aos-delay="50">
                                    <div className="card-body p-5">
                                        <div className="card-content">
                                            <div className="card-image mb-3 mb-md-5 brand"><a href="#"><img src="images/brands/b.png" alt="brand" className="h-24px"/></a></div>
                                            <h4 className="card-title text-capitalize mb-3 mb-md-5"><a href="blog-single.html">NioLand claims to be the #1 player in the analytics industry</a></h4>
                                            <div><a href="blog-single.html" className="btn-link"><span>Read More</span><em className="icon ni ni-arrow-right"></em></a></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12" data-aos="fade-up" data-aos-delay="0">
                                <div className="card card-gutter-md bg-dark is-theme">
                                    <div className="card-body p-5">
                                        <div className="card-content">
                                            <div className="card-image mb-3 mb-md-5 brand"><a href="#"><img src="images/brands/c.png" alt="brand" className="h-24px"/></a></div>
                                            <h4 className="card-title text-capitalize mb-3 mb-md-5"><a href="blog-single.html">NioLand CEO steps-back, new CEO comes in September after the board decisions</a></h4>
                                            <div><a href="blog-single.html" className="btn-link"><span>Read More</span><em className="icon ni ni-arrow-right"></em></a></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </main>
        <Footer/>
    </div>
    </div>
    </>
  )
}
