
import { useEffect, useState } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { useAppStore, useWebStatePersist } from '@/store/ZustandStore'
import { saveData } from '@/utils/saveData'
import { useNavigate } from 'react-router-dom'

type EpisodesContainerProps = {
    animeData : any
    isLoading : boolean
}

export const EpisodesContainer = ({ animeData, isLoading } : EpisodesContainerProps) => {
    // Page Navigator
    const navigate = useNavigate()
    
    // Theme Toggle
    const {isCheckedTheme} = useAppStore()

    // Anime Storage Data
    const { animeDetails } = useWebStatePersist()

    // Pagination Controller
    const [page, setPage] = useState<{ startPage: number; endPage: number }>({
        startPage: 1,
        endPage: 100,
    })

    // Range Dropdown
    const [ranges, setRanges] = useState<string[]>([])
    const [selectedRange, setSelectedRange] = useState('')

    // Load available data in dropdown
    useEffect(() => {
      generateRanges()
    }, [animeData?.totalEpisodes])
    
    const generateRanges = () => {
      const numRanges = Math.ceil(animeData?.totalEpisodes / 100)
      const newRanges = Array.from({ length: numRanges }, (_, index) => {
        const start = index * 100 + 1;
        const end = Math.min((index + 1) * 100, animeData?.totalEpisodes)
        return `${start}-${end}`
      })
      setRanges(newRanges)
    }

    // Onchange event in dropdown
    const handleRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value
      setSelectedRange(event.target.value)

      if (selectedValue !== '') {
        const [startStr, endStr] = selectedValue.split('-')
        const start = parseInt(startStr, 10)
        const end = parseInt(endStr, 10)
        setPage((prevPage) => ({
          ...prevPage,
          startPage: start,
          endPage: end
        }))
      } 
      else {
        setPage((prevPage) => ({
          ...prevPage,
          startPage: 1,
          endPage: 100
        }))
      }
    }

  return (
    <section className={`min-h-[14rem] w-full custom-transition-duration pb-10 lg:pb-14 ${isCheckedTheme ? 'bg-custom-dark-1' : 'bg-white'}`}>
        <div className={`max-w-[80%] sm:max-w-none w-10/12 mx-auto mt-16`}>
            {/* Headers */}
            <h1 className={`text-4xl font-semibold text-center lg:text-left pt-0
              custom-transition-duration ${isCheckedTheme ? 'text-custom-gray-4 ' : 'text-custom-dark-1'}`}
            >
              All Episodes
            </h1>

            <div className="flex flex-col lg:flex-row justify-between items-center border-b-2 border-custom-blue-1 pb-5 gap-x-10 mt-4 lg:mt-2">
                <p className={`text-base  text-center lg:text-left custom-transition-duration ${isCheckedTheme ? 'text-custom-gray-1' : 'text-custom-dark-2'}`}>
                    Unwind and savor the pleasure of watching your favorite shows for a relaxing and enjoyable experience.
                </p>

                {/* Filter Page */
                  animeData?.totalEpisodes && animeData?.totalEpisodes >= 100 &&
                    <select 
                      value={selectedRange} 
                      onChange={handleRangeChange} 
                      className="text-white bg-custom-dark-2 px-5 py-2 rounded-md disable-highlight cursor-pointer whitespace-nowrap mt-4 lg:mt-[-.50rem] outline-none"
                    >
                      {ranges.map((range, index) => (
                        <option key={index} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                }
            </div>

            <div className="mt-7">
              <p className={`text-base custom-transition-duration ${isCheckedTheme ? 'text-white' : 'text-custom-dark-2'}`}>Color Legends</p>

              <div className="flex flex-wrap gap-x-5 gap-y-3 mt-2">
                {/* Not Watch */}
                <div className="flex items-center gap-x-2">
                  <div className="h-[20px] w-[20px] bg-[#122532] rounded-sm"></div>
                  <p className={`text-sm custom-transition-duration ${isCheckedTheme ? 'text-custom-gray-1' : 'text-custom-dark-2'}`}>- Not watch</p>
                </div>

                {/* Already Watched */}
                <div className="flex items-center gap-x-2">
                    <div className="h-[20px] w-[20px] bg-[#0063F2] rounded-sm"></div>
                    <p className={`text-sm custom-transition-duration ${isCheckedTheme ? 'text-custom-gray-1' : 'text-custom-dark-2'}`}>- Already watched</p>
                </div>

                {/* Last Watched */}
                <div className="flex items-center gap-x-2">
                  <div className="h-[20px] w-[20px] bg-[#cac9c9] rounded-sm"></div>
                  <p className={`text-sm custom-transition-duration ${isCheckedTheme ? 'text-custom-gray-1' : 'text-custom-dark-2'}`}>- Last watched</p>
                </div>
              </div>
            </div>

        </div>

        {/* Episodes Container */}
        <div className="`max-w-[80%] sm:max-w-none w-10/12 mx-auto mt-10 grid gap-5 
            grid-cols-2 400size:grid-cols-3 sm:grid-cols-4 800size:grid-cols-5 lg:grid-cols-6
            1220size:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-9 1700size:grid-cols-10"
        >
            {isLoading ?
                Array.from({ length: 100 }, (_, index) => (
                        <Skeleton key={index} className="rounded w-full h-[2rem]"/>
                )) 
            :
                animeData?.episodes?.map((res: any) => {
                  if (res?.number && page?.startPage <= res.number && res.number <= page?.endPage) {
                    const isWatched = animeDetails.find(item => item.animeId === animeData?.id && item.watchedEpisode.includes(res?.number))
                    const lastWatched = animeDetails.find(item => item.animeId === animeData?.id)?.watchedEpisode.slice(-1)[0]

                    return (
                      <div
                        className={`rounded text-xs 400size:text-sm py-2 flex justify-center 
                          disable-highlight cursor-pointer hover:opacity-90 active:scale-95
                          ${(isWatched && lastWatched !== res?.number) ? 'bg-[#0063F2] text-white' : 
                          lastWatched === res?.number ? 'bg-[#cac9c9] text-custom-dark-1 font-medium' : 
                          'bg-[#122532] text-custom-gray-1'}
                          `}
                        key={res?.id}
                        onClick={() => {saveData(animeData?.id, res?.number); navigate(`/watch/${animeData?.id}/${res?.id}`)}}
                      >
                        EP {res?.number} &nbsp;
                        <span className={
                          `text-xs 400size:text-sm uppercase 
                          ${(isWatched && lastWatched !== res?.number) ? 'text-white' : lastWatched === res?.number ? 'text-custom-dark-1' : 'text-custom-gray-1'}`
                          }
                        >
                          | {animeData?.subOrDub}
                        </span>
                      </div>
                    )
                  }
                })
            }
        </div>
    </section>
  )
}