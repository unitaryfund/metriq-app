const UserGuidelines = () => {
  return (
    <div id='metriq-main-content' className='container'>
      <div className='row'>
        <div className='col-md-2' />
        <div className='col-md-8 text-justify'>
          <h1 className='text-center'>User Guidelines</h1>
          <br />
          <h2 className='text-center'>About Metriq</h2>
          <div>
            <p>
              Metriq is a platform to benchmark quantum computers, https://metriq.info/. It covers benchmarks on high-level applications like:
            </p>
            <p><i><a href='https://metriq.info/Task/3'>“How good are quantum computers at solving instances of the Maximum Cut problem?”</a></i></p>
            <p>or</p>
            <p><i><a href='https://metriq.info/Task/69'>“What’s the most difficult Traveling Salesman problem solved by a quantum algorithm?”</a></i></p>
            <p>down to the inner-workings of quantum computer devices and platforms themselves, like</p>
            <p><i><a href='https://metriq.info/Task/25'>“What is the best result a given compiler can do for a given quantum program, e.g., in terms of minimum quantum circuit depth?”</a></i></p>
          </div>
          <br />
          <h2 className='text-center'>Submissions, Tags, Methods, Platforms, Metrics and Results</h2>
          <div>
            <p>
              Submissions are research papers, software projects, or verified communications, which, once added to the Metriq platform, are listed and can be discovered by the whole community. Submissions can be tagged with Tags. Submissions can be connected to one or more Tasks, Methods and Platforms. Results reporting numerical Values for specific Metrics can be extracted from Submission.
            </p>
            <p>
              Tasks are the objective of benchmarking.<br />
              Methods are the procedures, like algorithms or techniques.<br />
              Platforms refer to anything hardware related.<br />
              Results report numerical Values of given Metrics from specific Submissions.<br />
            </p>
            <p>
              If more than three Value Results get added to a given Metric, Metriq automatically generates beautiful charts <a href='https://metriq.info/Task/34'>like this one</a>.
            </p>
          </div>
          <br />
          <h2 className='text-center'>Submissions</h2>
          <div>
            <ul>
              <li>
                Users can make submissions to add to the Metriq database papers or software projects (or other information-worth material) that help the community learn more about the state of the art in quantum computing.
              </li>
              <li>
                <i>Examples</i>: A research paper, GitHub repo, Zenodo link
              </li>
              <li>
                If a paper is published on arXiv, please use the arXiv abstract link as reference URL. The Metriq project favors open-access and long-standing resources for easier retrieval, and the arXiv is the gold standard for this.
              </li>
              <li>
                If you are unsure about the Description of a Submission, a good blurb is provided by the Abstract, in case of a paper, or of the project description or first part of the Readme file in case of a project, e.g., if hosted on a public repository like Github or Gitlab.
              </li>
              <li>
                If you run into some values that you are not sure how to specify (for example, the paper didn't provide them) just omit them, that's okay.
              </li>
            </ul>
          </div>
          <br />
          <h2 className='text-center'>Tags</h2>
          <div>
            <ul>
              <li>
                What makes a good tag? Any keyword that you think would help a user find a given submission. Think of them as hashtags or journal keywords.
              </li>
              <li>
                Tags are great aggregators to explore the literature.
              </li>
              <li>
                All tags are automatically formatted to lowercase.
              </li>
              <li>
                Look for existing tags before adding new ones. Existing tags are prompted as you type the ones to add.
              </li>
              <li>
                Tags can be added either at the time of submission creation or at a later time, on the specific Submission page.
              </li>
              <li>
                "Tags should be as <b>explicit</b> as possible ('variational quantum algorithm' rather than 'vqa') and <b>single</b> is preferred to plural ('algorithm' rather than 'algorithms').
              </li>
            </ul>
          </div>
          <br />
          <h2 className='text-center'>Tasks</h2>
          <div>
            <ul>
              <li>
                Tasks are the goal of a given benchmark.
              </li>
              <li>
                When submitting a task, look for existing tasks before adding new ones. Existing tasks are listed in a drop-down menu.
              </li>
              <li>
                There are five top level categories of tasks showcased on the Tasks page: Applications, Hardware, Quantum Error Correction and Mitigation, Compilers, Simulators.
              </li>
              <li>
                All new tasks you create require one “parent task”. “Child tasks” are more specific tasks that are helpful to differentiate among different experiments.
              </li>
              <li>
                <i>Example task</i>: Maximum Cut (or MAXCUT).
              </li>
            </ul>
          </div>
          <br />
          <h2 className='text-center'>Methods</h2>
          <div>
            <ul>
              <li>
                Methods are techniques, protocols, or procedures that are compared on their abilities to achieve a given task.
              </li>
              <li>
                <i>Example</i>: Zero-Noise Extrapolation is a specific method that allows one to achieve the task of Error mitigation.
              </li>
            </ul>
          </div>
          <br />
          <h2 className='text-center'>Platforms</h2>
          <div>
            <ul>
              <li>
                Platforms are explicit property lists of environmental and device factors that must be controlled to recreate the result. This could include things like hardware quantum device names, software versions, classical computer type/OS, etc..
              </li>
              <li>
                Platforms, like tasks and methods, support a nested structure in “Child Platforms”. Children are understood to inherit and potentially override parent properties. This could be useful when there are different versions of a compiler, or different revisions of a device architecture.
              </li>
              <li>
                <i>Examples</i>: an IBM-Q processor; the classical hardware a quantum computer simulator was executed on
              </li>
            </ul>
          </div>
          <h2 className='text-center'>Results</h2>
          <div>
            <ul>
              <li>
                Results for specific metrics are the fabric of Metriq!
              </li>
              <li>
                Results are metric name/value pairs that can be extracted from Submissions (papers, codebases, verified announcements).
              </li>
              <li>
                Extracting results of specific metrics from papers or datasets is generally hard: Thank you for your help in doing it!
              </li>
              <li>
                <b>Metrics</b>: These are the physical, mathematical or statistical quantities that are measured or evaluated.
              </li>
              <li>
                <b>Values</b>: These are numerical values. Data points for the same metric are shown together.
              </li>
              <li>
                <b>Notes</b>: Notes in Results can be used to add brief miscellaneous result-specific context, like a link to a code snippet, as a Jupyter Notebook hosted on Github.
              </li>
            </ul>
          </div>
          <div className='col-md-2' />
        </div>
      </div>
    </div>
  )
}

export default UserGuidelines
