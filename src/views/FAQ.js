const FAQ = () => {
  return (
    <div class='container content content-buffer '>
      <div className='row'>
        <div class='col-md-2' />
        <div class='col-md-8'>
          <h1>F.A.Q.</h1>
          <h2>What is metriq?</h2>
            <p>
                The purpose of the metriq platform is to allow users to answer the following question:
                <blockquote>
                    How does quantum computing platform "X" running software stack
                    "Y" perform on workload "Z", and how has that changed over time?
                </blockquote>
                Developers and companies can submit benchmarking results
                easily, via web form or Python client.
            </p>
            <p>
                The goal of metriq is to become a focal point for present
                benchmarking efforts sprouting up in the quantum ecosystem.
            </p>
          <h2>What is a metriq submission?</h2>
            <p>
                A metriq <b>"submission"</b> can be an arXiv preprint, GitHub
                repository, or links to peer reviewed and published articles. A
                submission can present or utilize one of more <b>"methods"</b> by
                which they accomplish one or more <b>"tasks"</b>, which are workloads
                of interest.
            </p>
            <p>
                <b>"Results"</b> are quantitative <b>metric</b> values at the
                intersection of <b>one method</b> and <b>one task</b>, reported in
                or independently recreated from a <b>submission</b>.
            </p>
          <h2>How are submissions reviewed?</h2>
            <p>
                Submissions are received and reviewed by a panel to verify the
                authenticity and claims of the benchmark. Once the submission
                has been approved, it will appear under the main submission view
                on metriq.
            </p>
        </div>
        <div class='col-md-2' />
      </div>

    </div>
  )
}

export default FAQ
