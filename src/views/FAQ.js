const FAQ = () => {
  return (
    <div id='metriq-main-content' className='container'>
      <div className='row'>
        <div className='col-md-2' />
        <div className='col-md-8 text-justify'>
          <h1 className='text-center'>Frequently Asked Questions (F.A.Q.)</h1>
          <br />
          <h2 className='text-center'>What is Metriq?</h2>
          <div>
            <p>
              The purpose of the metriq platform is to allow users to answer the following question:
            </p>
            <p>
              <em>How does quantum computing platform "X" running software stack "Y" perform on workload "Z", and how has that changed over time?</em>
            </p>
            <p>
              Developers and companies can submit benchmarking results easily, via web form or Python client.
            </p>
            <p>
              The goal of metriq is to become a focal point for present benchmarking efforts sprouting up in the quantum ecosystem.
            </p>
          </div>
          <br />
          <h2 className='text-center'>What is a Metriq submission?</h2>
          <div>
            <p>
              A metriq <b>"submission"</b> can be an arXiv preprint, GitHub repository, or links to peer reviewed and published articles.
            </p>
            <center>
              <iframe title='How to make a submission on Metriq: the platform for community driven quantum benchmarks' width='420' height='315' src='https://www.youtube.com/embed/XjLeutpo3v0'>
              </iframe>
            </center>
            <p>
              A submission can present or utilize one of more <b>"methods"</b> by which they accomplish one or more <b>"tasks"</b>, which are workloads of interest.
            </p>
            <p>
              <b>"Results"</b> are quantitative <b>metric</b> values at the intersection of <b>one method</b> and <b>one task</b>, reported in or independently recreated from a <b>submission</b>.
            </p>
          </div>
          <br />
          <h2 className='text-center'>How are submissions reviewed?</h2>
          <div>
            <p>
              Submissions are received and reviewed by a panel to verify the authenticity and claims of the benchmark. Once the submission has been approved, it will appear under the main submission view on metriq.
            </p>
          </div>
        </div>
        <div className='col-md-2' />
      </div>
    </div>
  )
}

export default FAQ
