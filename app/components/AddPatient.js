"use client";
import { useState } from "react";
export default function AddPatient() {
  const [step, setStep] = useState(1);
  return (
    <div className="bg-white w-full p-4 pt-2 pb-6">
      <div className="flex flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold">Add New Patient</h1>
          <p className="text-gray-500">
            Complete the patient profiling form below to register a new clinical
            record.
          </p>
        </div>
        <div className="border w-full border-gray-300 overflow-hidden mt-2 rounded-lg">
          <div className="bg-blue-200 flex items-center justify-between border border-gray-300 p-2 rounded-t-lg">
            <h1 className="text-[#00685F] text-2xl font-bold">
              Patient's Information Form
            </h1>
            <span className="bg-white border border-gray-300 rounded-lg px-2 py-1 text-sm text-gray-500">
              Rec: #New
            </span>
          </div>

          <div className="p-2 mx-2">
            {step === 1 && (
              <>
            <div className="font-bold mt-4">Basic Information</div>
            <hr className="border border-gray-200" />
            <div className="grid grid-cols-4 mt-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  placeholder="Last, First, M.I."
                  className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:border-[#00685F]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Birth Date</label>
                <input
                  type="text"
                  placeholder="mm/dd/yyyy"
                  className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:border-[#00685F]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Age</label>
                <input
                  type="text"
                  placeholder="0"
                  className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:border-[#00685F]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Sex</label>
                <select className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:border-[#00685F]">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <div className="flex flex-col gap-1 w-72">
                <label className="text-sm font-medium">Tel/CP No.</label>
                <input
                  type="text"
                  placeholder="09XX-XXX-XXXX"
                  className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:border-[#00685F]"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm font-medium">Complete Address</label>
                <input
                  type="text"
                  placeholder="Street, City, State, Zip"
                  className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:border-[#00685F]"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 mt-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Occupation</label>
                <input
                  type="text"
                  className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:border-[#00685F]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Civil Status</label>
                <select className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:border-[#00685F]">
                  <option value="">Single</option>
                  <option value="male">Maried</option>
                  <option value="female">Widowed</option>
                  <option value="female">Separated </option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Nationality</label>
                <input
                  type="text"
                  className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:border-[#00685F]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Religion</label>
                <input
                  type="text"
                  className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:border-[#00685F]"
                />
              </div>
            </div>
            <div className="font-bold mt-4">Chief Complaint</div>
            <hr className="border border-gray-200" />
            <div className="flex gap-4 mt-2">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm font-medium">
                  CHIEF COMPLAINT (Patient's own words)
                </label>
                <textarea className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full h-24" />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm font-medium">
                  History of Present Illness
                </label>
                <textarea className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full h-24" />
              </div>
            </div>
            <div className="font-bold mt-4">Medical History</div>
            <hr className="border border-gray-200" />
            <div className="bg-[#EFF4FF] border-gray-200 p-4 mt-2 rounded-lg">
              <label className="text-sm font-medium">
                Check all conditions that apply to the patient:
              </label>
              <div className="grid grid-cols-5 gap-4 mt-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Rheumatic Heart Disease
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Asthma
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Stomach Ulcer
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Liver Disease
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Hypertension
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Coronary Artery Disease
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Diabetes
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Kidney Disease
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Persistent Cough
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Hypotension
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Stroke(CVA)
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Arthritis
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> STD
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> Pregnant(For Women)
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">
                  1. Are you under any medication/s?
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="medication" value="yes" /> Yes
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="medication" value="no" /> No
                </label>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">
                  2. Do your gums bleed easily when brushing?
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="gums" value="yes" /> Yes
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="gums" value="no" /> No
                </label>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">3. Do you smoke?</label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="smoke" value="yes" /> Yes
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="smoke" value="no" /> No
                </label>
                <input
                  type="text"
                  placeholder="If yes, how many sticks per day?"
                  className="border-b border-gray-300 outline-none ml-2 w-58 min-w-0"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">
                  4. Do you have any known ALLERGY/ies?
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="allergy" value="yes" /> Yes
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="allergy" value="no" /> No
                </label>
              </div>
            </div>
            <div className="flex gap-4 mt-2">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm font-medium">
                  Current Medications
                </label>
                <textarea className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full h-24" />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-sm text-red-700">Known Allergies</label>
                <textarea className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full h-24" />
              </div>
            </div>
            <div className="flex gap-8 mt-2">
              <div className="flex flex-col gap-1 flex-1">
                <div className="font-bold mt-4">Dental History</div>
                <hr className="border border-gray-200 w-full" />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">
                      Previous Oral Prophylaxis
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="cleaning" value="yes" /> Yes
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="cleaning" value="no" /> No
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="If yes, when?"
                    className="border-b border-gray-300 outline-none w-58 min-w-0"
                  />
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">
                      Previous Dental Extraction
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="extraction" value="yes" /> Yes
                    </label>
                    <label className="flex items-center gap-1">
                      <input type="radio" name="extraction" value="no" /> No
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="If yes, when?"
                    className="border-b border-gray-300 outline-none w-58 min-w-0"
                  />
                  <label className="text-sm font-medium">
                    Denture Type (if applicable)
                  </label>
                  <select className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2">
                    <option value="">Select</option>
                    <option value="male">None</option>
                    <option value="female">Partial</option>
                    <option value="female">Full</option>
                  </select>
                </div>
              </div>
            </div>
              </>
            )}
            {step === 2 && (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <h2 className="text-2xl font-bold text-[#00685F]">
                  Thank you for sharing your information
                </h2>
                <p className="text-gray-500">
                  Please wait for the dentist to continue your examination.
                </p>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="rounded-lg bg-[#00685F] px-6 py-3 text-sm font-medium text-white hover:bg-[#004c4a]"
                >
                  Begin Vital Signs &amp; Intraoral Examination
                </button>
              </div>
            )}
            {step === 3 && (
              <>
              <div className="flex flex-col gap-1 flex-1">
                <div className="font-bold mt-4">Clinical / Vital Signs</div>
                <hr className="border border-gray-200 w-full" />
                <div className="flex gap-4">
                  <div className="flex flex-col flex-1">
                    <label className="text-sm font-medium">
                      Blood Pressure(mmHg)
                    </label>
                    <input
                      type="text"
                      placeholder="120/80"
                      className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:border-[#00685F]"
                    />
                    <label className="text-sm font-medium">
                      Respiratory Rate (cpm)
                    </label>
                    <input
                      type="text"
                      placeholder="16"
                      className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:border-[#00685F]"
                    />
                  </div>

                  <div className="flex flex-col  flex-1">
                    <label className="text-sm font-medium">
                      Pulse Rate (bpm)
                    </label>
                    <input
                      type="text"
                      placeholder="72"
                      className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:border-[#00685F]"
                    />
                    <label className="text-sm font-medium">
                      Temperature (°C)
                    </label>
                    <input
                      type="text"
                      placeholder="36.5"
                      className="bg-[#F0FDFA] border border-gray-300 rounded-lg px-3 py-2 w-full outline-none focus:border-[#00685F]"
                    />
                  </div>
                </div>
                <div className="font-bold mt-4">Extraoral</div>
                <hr className="border border-gray-200 w-full" />
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <label className="w-16">Head:</label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" /> Normal
                    </label>
                    <label className="text-sm font-medium">
                      Abnormality, specify
                    </label>
                    <input
                      type="text"
                      className="border-b border-gray-300 outline-none flex-1 min-w-0"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="w-16">Eyes:</label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" /> Normal
                    </label>
                    <label className="text-sm font-medium">
                      Abnormality, specify
                    </label>
                    <input
                      type="text"
                      className="border-b border-gray-300 outline-none flex-1 min-w-0"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="w-16">TMJ:</label>
                    <label className="flex items-center gap-1">
                      <input type="checkbox" /> Normal
                    </label>
                    <label className="text-sm font-medium">
                      Abnormality, specify
                    </label>
                    <input
                      type="text"
                      className="border-b border-gray-300 outline-none flex-1 min-w-0"
                    />
                  </div>
                </div>
              </div>

            <div className="font-bold mt-4">Intraoral Examination</div>
            <hr className="border border-gray-200 w-full" />
            <div className="grid grid-cols-2 gap-8 mt-2">
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Lips</label>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-sm">
                      <input type="checkbox" /> Normal
                    </label>
                    <label className="text-sm font-medium">
                      Abnormal, specify
                    </label>
                    <input
                      type="text"
                      className="border-b border-gray-300 outline-none flex-1 min-w-0"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Palate</label>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-sm">
                      <input type="checkbox" /> Normal
                    </label>
                    <label className="text-sm font-medium">
                      Abnormal, specify
                    </label>
                    <input
                      type="text"
                      className="border-b border-gray-300 outline-none flex-1 min-w-0"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Tongue</label>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-sm">
                      <input type="checkbox" /> Normal
                    </label>
                    <label className="text-sm font-medium">
                      Abnormal, specify
                    </label>
                    <input
                      type="text"
                      className="border-b border-gray-300 outline-none flex-1 min-w-0"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">
                    Floor of the mouth
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-sm">
                      <input type="checkbox" /> Normal
                    </label>
                    <label className="text-sm font-medium">
                      Abnormal, specify
                    </label>
                    <input
                      type="text"
                      className="border-b border-gray-300 outline-none flex-1 min-w-0"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <div className="text-sm font-medium">Occlusion</div>
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm">
                      1st Molar Relationship
                    </label>
                    <input
                      type="text"
                      className="border-b border-gray-300 outline-none flex-1 min-w-0"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm">Canine Relationship</label>
                    <input
                      type="text"
                      className="border-b border-gray-300 outline-none flex-1 min-w-0"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-40 text-sm">Classification</label>
                    <input
                      type="text"
                      className="border-b border-gray-300 outline-none flex-1 min-w-0"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Gingiva</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="gingiva" /> Normal
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="gingiva" /> Inflamed
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="gingiva" /> Receded
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-500">Color</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="g_color" /> Coral Pink
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="g_color" /> Bright Red
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="g_color" /> Bluish Red
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-500">Consistency</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="g_cons" /> Firm
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="g_cons" /> Hyperplastic
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="g_cons" /> Smooth
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <label className="text-sm font-medium">Oral Hygiene</label>
                  <div className="flex items-center gap-4 flex-wrap">
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="hygiene" /> Healthy
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="hygiene" /> Gingivitis
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="hygiene" /> Periodontitis
                    </label>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap pl-4">
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="severity" /> Mild
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="severity" /> Moderate
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="severity" /> Severe
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="severity" /> Aggressive
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="severity" /> Chronic
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <label className="text-sm font-medium">Deposits</label>
                  <div className="flex items-center gap-2">
                    <label className="w-12 text-sm">Soft:</label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="soft" /> None
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="soft" /> Slight
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="soft" /> Moderate
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="soft" /> Severe
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-12 text-sm">Hard:</label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="hard" /> None
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="hard" /> Slight
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="hard" /> Moderate
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input type="radio" name="hard" /> Severe
                    </label>
                  </div>
                </div>
              </div>
            </div>
              </>
            )}
          </div>
          {/* Footer buttons */}
          <div className="flex justify-end gap-3 p-4">
            {step === 1 && (
              <button
                type="button"
                onClick={() => setStep(2)}
                className="rounded-lg bg-[#00685F] px-4 py-2 text-sm font-medium text-white hover:bg-[#004c4a]"
              >
                Submit
              </button>
            )}
            {step === 3 && (
              <>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 disabled:opacity-50"
                >
                  Discard Changes
                </button>
                <button
                  type="button"
                  onClick={() => {}}
                  className="rounded-lg bg-[#00685F] px-4 py-2 text-sm font-medium text-white hover:bg-[#004c4a] disabled:opacity-50"
                >
                  Save
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
