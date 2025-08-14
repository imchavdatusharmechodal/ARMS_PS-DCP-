import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PsReport() {
    const { id } = useParams(); // Get application ID from URL
    const [application, setApplication] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
   const token = localStorage.getItem("ps_token");

    useEffect(() => {
        if (id && token) {
            fetchPsReport(id, token);
        } else if (!token) {
            setError('Authentication token not found');
            setLoading(false);
        } else {
            setError('Application ID not provided');
            setLoading(false);
        }
    }, [id, token]);

    const fetchPsReport = async (applicationId, token) => {
        try {
            setLoading(true);
            const response = await axios.get(`https://lampserver.uppolice.co.in/validation-report/ps/${applicationId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status) {
                setApplication(response.data.data);
            } else {
                setError('Failed to fetch PS report');
            }
        } catch (error) {
            console.error('Error fetching PS report:', error);
            setError('Error loading PS report');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className='container py-4 text-center'>Loading...</div>;
    }

    if (error) {
        return <div className='container py-4 text-center text-danger'>{error}</div>;
    }

    if (!application) {
        return <div className='container py-4 text-center'>No PS report found</div>;
    }

    return (
        <div className='container-fluid py-4'>
             <style>
                {`
                    .custom-table th, .custom-table td {
                        width: 33.33%;
                    }
                    .custom-table td[colspan="2"] {
                        width: 33.33%;
                    }
                    @media print {
                        .no-print {
                            display: none;
                        }
                    }
                `}
            </style>
            <div className='row'>
                <div className='col-12 mb-4 text-end'>
                    <button className='btn btn-verify no-print' onClick={() => window.print()}>
                        Print PDF
                    </button>
                </div>
                <div className='col-12'>
                    <div className='pdf-text text-center'>
                        <h3 className="mb-2">पूर्ववर्ती सत्यापन रिपोर्ट</h3>
                        <h4>(पुलिस विभाग द्वारा भरा जाएगा)</h4>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-12'>
                    <div className='table-responsive mt-table'>
                        <table className="table table-bordered custom-table" aria-label="Police Validation Report">
                            <tbody>
                                <tr>
                                    <th className='tble-pdf-center' scope="col" colSpan={3}>VALIDATION REPORT</th>
                                </tr>
                                <tr>
                                    <th scope="col">1. आवेदक का नाम</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.applicant_name || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="col">2. पिता/पति-पत्नी का नाम</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.father_spouse_name || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>3. वर्तमान पता</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.current_address || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>वर्तमान पता का नजदीक पुलिस थाना</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.nearest_police_station || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>4. क्या आवेदक कभी दोषसिद्ध हुआ है?</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.ever_convicted || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>(क) यदि हां, अपराध, दंडादेश और दंडादेश की तारीख</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.conviction_details || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>(ख) क्या आवेदक पर डीपी एक्ट लगाया गया है?</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.dp_act_applied || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>यदि हाँ, तो विवरण</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.dp_act_details || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>(ग) क्या आवेदक पर आर्म्स एक्ट लगाया गया है?</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.arms_act_applied || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>यदि हाँ, तो विवरण</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.arms_act_details || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>5. क्या आवेदक का किसी से शत्रुता है?</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.has_enemy || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>यदि हाँ, ब्यौरा दीजिए।</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.enemy_details || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>6. क्या आवेदक का पता सत्यापित किया गया है?</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.address_verified || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>पता सत्यापन का विवरण</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.address_verification_details || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>7. क्या आवेदक का व्यवसाय सत्यापित किया गया है?</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.business_verified || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>व्यवसाय सत्यापन का विवरण</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.business_verification_details || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>8. क्या आवेदक के विरूद्ध कोई शिकायत दर्ज है?</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.complaint_registered || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>शिकायत का विवरण</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.complaint_details || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>9. क्या आवेदक किसी अपराध में संलिप्त रहा है?</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.involved_in_crime || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>अपराध का विवरण</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.crime_details || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>10. क्या आवेदक कभी गिरफ्तार हुआ है?</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.ever_arrested || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>गिरफ्तारी का विवरण</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.arrest_details || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>11. क्या आवेदक का नाम खराब चरित्र रजिस्टर में है?</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.bad_character_register || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>खराब चरित्र का विवरण</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.bad_character_details || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>12. क्या सरकारी मामला दर्ज है?</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.govt_case_registered || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>सरकारी मामले का विवरण</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.govt_case_details || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>13. क्या जान से मारने की धमकी है?</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.life_threat || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>जान से मारने की धमकी का विवरण</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.life_threat_details || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>14. राजनीतिक संगठन का विवरण</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.political_organization_details || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td scope="col" colSpan={3}>प्रमाणित किया जाता है कि मैंने आवेदक द्वारा जमा किए गए आयुध अनुज्ञप्ति दान करने के लिए आवेदन प्ररूप की विषय-वस्तुओं को चैक कर लिया है।</td>
                                </tr>
                                <tr>
                                    <th scope="col">रिपोर्ट की तारीख</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.report_date?.slice(0, 10).split("-").reverse().join("/") || 'N/A'}</span>
                                    </td>
                                </tr>
                                {/* <tr>
                                    <th scope="col">थाना प्रभारी</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.police_station_incharge || 'N/A'}</span>
                                    </td>
                                </tr> */}
                                <tr>
                                    <th scope="col">पुलिस थाना</th>
                                    <td scope="col" colSpan={2}>
                                        <span>{application.police_station_name || 'N/A'}</span>
                                    </td>
                                </tr>
                                <tr>
                                <th scope="col">द्वारा सौंपा गया</th>
                                <td scope="col" colSpan={2}>
                                    <span>{application.assigned_by || 'N/A'}</span>
                                </td>
                                </tr>
                                <tr>
                                    <th scope="col">हस्ताक्षर</th>
                                    <td scope="col" colSpan={2}>
                                        {application.signature_path ? (
                                            <div className='signature-img'>
                                                <img 
                                                    src={`https://lampserver.uppolice.co.in${application.signature_path}`} 
                                                    alt="Official Signature" 
                                                    className='signature-img'
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'block';
                                                    }}
                                                />
                                                <span style={{display: 'none'}}>हस्ताक्षर उपलब्ध नहीं</span>
                                            </div>
                                        ) : (
                                            <span>हस्ताक्षर उपलब्ध नहीं</span>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PsReport;