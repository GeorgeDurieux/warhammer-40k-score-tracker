import { useState } from "react"
import CustomButton from "../components/CustomButton"
import Modal from "../components/Modal"
import Title from "../components/Title"

function Home() {

    const [isAppModalOpen, setIsAppModalOpen] = useState(false)
    const [isGameModalOpen, setIsGameModalOpen] = useState(false)

    return (
        <div className="flex flex-col items-center gap-8">
            <Title title='Warhammer 40k Score Tracker' />

            <CustomButton 
                children="About Warhammer 40k"
                onClick={() => setIsGameModalOpen(true)}
            />

            <CustomButton 
                children="About the Score Tracker"
                onClick={() => setIsAppModalOpen(true)}
            />

            <Modal 
                isOpen={isAppModalOpen} 
                onClose={() => setIsAppModalOpen(false)} 
                title="About the App"
            >
                <h3 className="py-2 text-xl font-bold">The Score Tracker</h3>

                <p>This app is a simple tool to help you keep track of your Warhammer 40K games. It records your matches, scores, and opponents, then gives you an overview of how you’re doing over time.</p>

                <h4 className="py-2 text-lg font-bold">What you can do:</h4>

                <ul className="list-disc pl-5">
                    <li>Log each game you play, including date, armies, detachments, and final scores.</li>
                    <li>Mark whether a game was part of a tournament and give it a name if you want.</li>
                    <li>See basic stats like winrate and average score.</li>
                    <li>Use filters to check your results against certain armies or in specific events.</li>
                    <li>Switch to WTC scoring mode (0–20 points) if you play competitive team formats.</li>
                </ul>

                <p className="py-2">The goal is to keep your game history in one place and make it easy to review your results later.</p>

                <p className="py-2">The app was developed due to the lack of such an app, and the need for it. Too many players, especially amongst the competitive scene, use excel, notepads or other similar, non specialized apps, to track their progress.</p>

            </Modal>

            <Modal 
                isOpen={isGameModalOpen} 
                onClose={() => setIsGameModalOpen(false)} 
                title="About the Game"
            >
                <div className="">

                    <h3 className="py-2 text-xl font-bold">About Warhammer 40K & Scoring</h3>

                    <p>Warhammer 40K is a tabletop miniature game where players build armies and face off in battles. 
                    Games are scored based on completing objectives, usually adding up to 100 points per match.</p>

                    <h4 className="py-2 text-lg font-bold">Armies:</h4>

                    <p>Each army represents a faction (like Space Marines, Tyranids, Orks, etc.). 
                    Your choice of army determines what units and abilities you can use.</p>

                    <h4 className="py-2 text-lg font-bold">Detachments:</h4>

                    <p>Detachments are specific rule sets you can select for your army. 
                    They give you certain bonuses or playstyles and help shape your overall strategy.</p>

                    <h4 className="py-2 text-lg font-bold">Scoring:</h4>

                    <ul className="list-disc pl-5">
                        <li><strong>Standard scoring:</strong> Out of 100 total points, based on primary and secondary objectives.</li>
                        <li><strong>WTC (World Team Championship) scoring:</strong> Converts the final point difference into a score from 0 (loss) to 20 (big win). 
                        Often used in team events.</li>
                    </ul>

                    <p className="pt-2">This app lets you record either system and see your results over time.</p>

                    <h4 className="py-2 text-lg font-bold">More:</h4>

                    <a href="https://en.wikipedia.org/wiki/Warhammer_40,000" className="underline">Wikipedia: Warhammer 40000</a>

                </div>

            </Modal>

        </div>
    )
}

export default Home