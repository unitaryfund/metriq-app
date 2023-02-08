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
            <iframe title='How to make a submission on Metriq: the platform for community driven quantum benchmarks' width='420' height='315' src='https://www.youtube.com/embed/XjLeutpo3v0' />
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
          <h2 className='text-center'>My result has overlapping task, method, or metric names</h2>
          <div>
            <p>
              In most cases, submitting an associated result with a submission will result in distinct task, method, and metric names (i.e. <a href='https://metriq.info/Submission/42'>https://metriq.info/Submission/42</a>). However, based on our taxonomy and the way in which certain results are presented, it is possible that when submitting a result, the task, method, and metric names may all be some variation of the same thing (i.e. <a href='https://metriq.info/Submission/244'>https://metriq.info/Submission/244</a>). As results can be fairly case-by-case, please use your best discretion as to how best populate these fields, but know that duplication (as in <a href='https://metriq.info/Submission/244'>https://metriq.info/Submission/244</a>) can arise and be valid.
            </p>
          </div>
          <h2 className='text-center'>Parent hierarchy of tasks, methods, and platforms</h2>
          <div>
            <p>
              When adding a task, method, or platform, one has the ability to add both a general parent item as well as a more specific child item. For instance, "Algorithmic Qubits" is a child task of "Applications". When a more specific task, method, or platform option is appropriate, opt to select the more specific option as opposed to the parent task.
            </p>
          </div>
        </div>
        <div className='col-md-2' />
      </div>
    </div>
  )
}

export default FAQ
