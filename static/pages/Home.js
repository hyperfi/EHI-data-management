export default Vue.defineComponent({
  name: 'Home',
  template: `
     <div>
    <!-- Hero Section -->
    <div class="hero-section position-relative text-white text-center mb-0" style="min-height: 100vh; background: rgba(22,34,58,0.0);">
      <div class="overlay position-absolute w-100 h-100" style="top:0; left:0; background-color: rgba(22, 34, 58, 0.22); z-index: 1;"></div>
      <div class="content position-relative" style="z-index: 2; padding-top: 100px;">
        <h1 class="display-3 fw-bold mt-4">Welcome to Event Horizon Institute</h1>
        <p class="lead mt-3">Empowering students with quality education and training for a brighter future.</p>
        <p class="lead mt-3">
          Join the premier foundation program for Classes 
          <span style="color: #ffd700; font-weight: bold;">
            9<sup>th</sup> to 12<sup>th</sup>
          </span>
          </br> and unlock your academic potential!
        </p>
        <button class="btn btn-primary btn-lg mt-4" @click="scrollToSection('about')">Learn More</button>
      </div>
    </div>

    <!-- About Section -->
    <div id="about" class="about-section py-5" style="background-color: rgba(34, 52, 89, 0.76);">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6 d-flex justify-content-center">
            <div class="founder-images d-flex flex-column flex-md-row align-items-center w-100">
              <div class="text-center me-md-4 mb-4 mb-md-0" style="width: 48%;">
                <img src="/static/images/founder1.jpg" alt="Founder 1" class="img-fluid shadow mb-2" style="width: 180px; height: 180px; object-fit: cover; border-radius: 50%; border: 4px solid #fff;">
                <div class="mt-2 text-white">
                  <h5 class="mb-1">Dr. Abhishek</h5>
                  <div><small>PhD IIT Roorkee</small></div>
                  <div><small>MSc NIT Jalandhar</small></div>
                  <div><small>Scientist, University of Surrey</small></div>
                  </div>
                  </div>
                  <div class="text-center" style="width: 48%;">
                  <img src="/static/images/founder2.jpg" alt="Founder 2" class="img-fluid shadow mb-2" style="width: 180px; height: 180px; object-fit: cover; border-radius: 50%; border: 4px solid #fff;">
                  <div class="mt-2 text-white">
                  <h5 class="mb-1">Dr. Bharti</h5>
                  <div><small>PhD IIT Roorkee</small></div>
                  <div><small>MSc Central University, CG</small></div>
                  <div><small>Scientist, University of Surrey</small></div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 text-white">
            <h2 class="fw-bold">About Us</h2>
            <p class="mt-3">
              Event Horizon Institute was founded with the vision of providing top-notch education and training to students. 
              Our mission is to empower individuals with the knowledge and skills they need to excel in their careers and make a positive impact on society.
            </p>
            <p class="mt-3">
              With a team of dedicated educators and state-of-the-art facilities, we strive to create an environment where students can thrive and achieve their full potential.
            </p>
          </div>
        </div>
      </div>
    </div>
        <!-- Available Courses Section -->
    <div class="courses-section py-5" style="background-color:rgba(31, 69, 110, 0.75); margin-bottom: 0px;">
      <div class="container">
        <h2 class="text-center fw-bold mb-4 display-6" style="color:rgb(246, 247, 249);">Available Courses</h2>
        <div class="row justify-content-center">
          <div class="col-md-5 mb-4">
            <div class="card shadow h-100">
              <div class="card-body">
                <h4 class="card-title text-center display-6" style="color: #223459; font-size: 2rem">Classes 9<sup>th</sup> &amp; 10<sup>th</sup></h4>
                <ul class="list-unstyled mt-3 mb-0 text-center">
                  <li class="mb-2"><span style="color:#007bff; font-weight:bold; ">Science</span></li>
                  <li><span style="color:rgb(60, 255, 0); font-weight:bold; ">Mathematics</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-md-5 mb-4">
            <div class="card shadow h-100">
              <div class="card-body">
                <h4 class="card-title text-center display-6" style="color: #223459; font-size:2rem">Classes 11<sup>th</sup> &amp; 12<sup>th</sup></h4>
                <ul class="list-unstyled mt-3 mb-0 text-center">
                  <li class="mb-2"><span style="color:#e83e8c; font-weight:bold; ">Physics</span></li>
                  // <li><span style="color:rgb(255, 187, 0); font-weight:bold; ">Mathematics</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

        <!-- Why Choose Us Section -->
    <div class="why-choose-section position-relative text-white text-center py-5" style="no-repeat center center/cover; margin-bottom: 0px; background-color: rgba(4, 15, 36, 0.61)">

      <div class="content position-relative" style="z-index: 2; max-width: 700px; margin: 0 auto;">
        <h2 class="display-4 fw-bold mb-4">Why Choose Us?</h2>
        <ul class="list-unstyled text-start mx-auto" style="max-width: 600px;">
          <li class="d-flex align-items-start mb-3">
            <span style="min-width: 2.5rem; display: inline-block; font-size:1.5rem; color:#ffd700; margin-right: 15px; text-align: center;">&#9733;</span>
            <span>Our faculty consists of highly experienced and qualified educators from top institutes.</span>
          </li>
          <li class="d-flex align-items-start mb-3">
            <span style="min-width: 2.5rem; display: inline-block; font-size:1.5rem; color:#00e6e6; margin-right: 15px; text-align: center;">&#9679;</span>
            <span>We provide personalized attention and dedicated mentoring to every student.</span>
          </li>
          <li class="d-flex align-items-start mb-3">
            <span style="min-width: 2.5rem; display: inline-block; font-size:1.5rem; color:#ff69b4; margin-right: 15px; text-align: center;">&#10024;</span>
            <span>Our teaching methods use engaging animations and illustrations to simplify complex concepts.</span>
          </li>
          <li class="d-flex align-items-start mb-3">
            <span style="min-width: 2.5rem; display: inline-block; font-size:1.5rem; color:#90ee90; margin-right: 15px; text-align: center;">&#127891;</span>
            <span>We focus on nurturing leadership qualities and fostering innovation in our students.</span>
          </li>
          <li class="d-flex align-items-start mb-3">
            <span style="min-width: 2.5rem; display: inline-block; font-size:1.5rem; color:#ffa500; margin-right: 15px; text-align: center;">&#128640;</span>
            <span>Regular assessments and exclusive doubt-solving sessions ensure continuous progress.</span>
          </li>
        </ul>
      </div>
      </div>

    <!-- Contact Section -->
    <div class="contact-section py-5 text-white text-center" style="background-color:rgb(34, 52, 89);">
      <div class="container">
        <h2 class="fw-bold">Contact Us</h2>
        <p class="mt-2">Have questions? Reach out to us at:</p>
        <p class="mt-2">
          <span class="fw-bold">Phone:</span> +91-8295433285, +91-9650287641
        </p>
        <p class="mt-0">
          <span class="fw-bold">Address:</span> V.P.O. Khanpur, </br> Indri, Karnal, India
        </p>
      </div>
    </div>
    </div>
  `,
  methods: {
    scrollToSection(sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0; // Get the navbar height
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: sectionTop - navbarHeight, // Adjust scroll position to stop at the navbar
          behavior: 'smooth',
        });
      }
    },
  },

});
