import braille from 'braille';
import React from 'react';
import Tabs from "./Tabs";
import ET from "../transcripts/English.txt";

class BackendAPI extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			name: '',
			error: null,
			isLoaded: false,
			isLoading: false,
			failedMessage: null
		};
	}

	handleChange = (event) => {

		this.setState({ [event.target.name]: event.target.value });
	}

	handleSubmit =  (event) => {

		this.setState({
			isLoading: true,
			isLoaded: false

		});

		var FinalURL = `http://127.0.0.1:5000/api/?video_url=${this.state.name}`;

		// console.log(response)	

		fetch(FinalURL)
			.then(res => res.json())
			.then(
				(result) => {
					console.log(result)
					if (result.data.message === "Success") {
						this.setState({
							isLoaded: true,
							isLoading: false,
							message: result.data.message,
							englishTranscript: result.data.eng_summary,
							originalTextLength: result.data.original_txt_length,
							summarizedTextLength: result.data.final_summ_length,
						});
					} else {
						this.setState({
							isLoaded: true,
							isLoading: false,
							failedMessage: result.data.error
						});
					}
				},

				(error) => {
					console.error({error})
					alert('An Error occured: ' + this.state);
					this.setState({
						isLoaded: true,
						isLoading: false,
						error: error
					});
				}
			)

		event.preventDefault();
	}

	stopAudio = () => {

		window.speechSynthesis.cancel();
	}

	textToAudio = () => {

		var synth = window.speechSynthesis;
		var utterance = new SpeechSynthesisUtterance(this.state.englishTranscript);
		synth.speak(utterance);

	}

	render() {

		const { isLoaded, isLoading, message, englishTranscript, hindiTranscript, gujaratiTranscript, brailleText, originalTextLength, summarizedTextLength } = this.state;

		if (isLoading) {

			return (
				<>
					<form onSubmit={this.handleSubmit}>
						<label>
							Video URL:
						</label>
						<input className="input-1" type="url" value={this.state.value} placeholder="Paste your YouTube Video link here." name="name" onChange={this.handleChange} required autoComplete="off" />
						<input className="submit-1" type="submit" value="Summarize" />
					</form>
					<center>
						<div className="lds-ripple"><div></div><div></div></div>
					</center>
					
				</>
			);
		} else if (isLoaded) {

			if (message === "Success") {

				return (
					<>
						<form onSubmit={this.handleSubmit}>
							<label>
								Video URL:
							</label>
							<input className="input-1" type="url" value={this.state.value} placeholder="Paste your YouTube Video link here." name="name" onChange={this.handleChange} required autoComplete="off" />
							<input className="submit-1" type="submit" value="Summarize" />
						</form>
						<div label="English">
								<div className="tab-content">
									<div>
										<center>
											<button className="btn-1" type="button" onClick={this.textToAudio}>Speak</button>
											<button className="btn-1" type="button" onClick={this.stopAudio}>Stop</button>
										</center>
										<center>
										<a href={ET} className="buttonDownload" download="English_Transcript.txt" type="button">Download</a>
										</center>
									</div>
									{englishTranscript}
								</div>
						</div>
						
					</>
				);
			}

			else {

				return (
					<>
						<form onSubmit={this.handleSubmit}>
							<label>
								Video URL:
							</label>
							<input className="input-1" type="url" value={this.state.value} placeholder="Paste your YouTube Video link here." name="name" onChange={this.handleChange} required autoComplete="off" />
							<input className="submit-1" type="submit" value="Summarize" />
						</form>
						<div>
							<br />
							An Error occured: {this.state.failedMessage}.
						</div>
				
					</>
				);
			}

		}

		else {

			return (
				<>
					<form onSubmit={this.handleSubmit}>
						<label>
							Video URL:
						</label>
						<input className="input-1" type="url" value={this.state.value} placeholder="Paste your YouTube Video link here." name="name" onChange={this.handleChange} required autoComplete="off" />
						<input className="submit-1" type="submit" value="Summarize" />
					</form>
					

				</>
			);
		}

	}
}

export default BackendAPI;